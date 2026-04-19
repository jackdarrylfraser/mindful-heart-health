import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { drizzleClient } from "@/src/lib/database";
import {
	purchase as purchaseTable,
	product as productTable,
	user as userTable,
} from "@/src/lib/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/src/lib/stripe";
import { z } from "zod";
import { isEventProcessed, markEventProcessed } from "./idempotency";
import { authentication } from "@/src/service/authentication";
import { headers } from "next/headers";
import { env } from "@/src/lib/env";

const sessionSchema = z.object({
	id: z.string(),
	customer_email: z.string().email().optional(),
	metadata: z
		.object({
			userId: z.string().optional(),
			productId: z.string().optional(),
		})
		.optional(),
	subscription: z.string().optional(),
	payment_intent: z.string().optional(),
});

export async function POST(req: NextRequest) {
	const sig = req.headers.get("stripe-signature");
	const buf = await req.arrayBuffer();
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			Buffer.from(buf),
			sig!,
			env.STRIPE_WEBHOOK_SECRET!,
		);
	} catch (err) {
		return NextResponse.json(
			{ error: `Webhook Error: ${(err as Error).message}` },
			{ status: 400 },
		);
	}

	// Idempotency check
	if (await isEventProcessed(event.id)) {
		return NextResponse.json({ received: true, idempotent: true });
	}

	if (event.type === "checkout.session.completed") {
		const session = sessionSchema.safeParse(event.data.object);
		if (!session.success) {
			return NextResponse.json(
				{ error: "Invalid session payload" },
				{ status: 400 },
			);
		}
		const s = session.data;
		let userId = s.metadata?.userId;
		const productId = s.metadata?.productId;
		const email = s.customer_email;
		if (!productId || !email)
			return NextResponse.json(
				{ error: "Missing productId or email" },
				{ status: 400 },
			);

		// Guest-to-user upgrade: find or create user by email
		if (!userId) {
			const [existing] = await drizzleClient
				.select()
				.from(userTable)
				.where(eq(userTable.email, email));
			if (existing) {
				userId = existing.id;
			} else {
				await authentication.api.signInMagicLink({
					body: { email },
					headers: await headers(),
				});

				const [existing] = await drizzleClient
					.select()
					.from(userTable)
					.where(eq(userTable.email, email));

				userId = existing.id;
			}
		}

		// Look up product for interval
		const [product] = await drizzleClient
			.select()
			.from(productTable)
			.where(eq(productTable.id, productId));
		if (!product)
			return NextResponse.json(
				{ error: "Product not found" },
				{ status: 404 },
			);

		// Calculate access window
		const now = new Date();
		let accessEnd = new Date(now);
		const interval = product.interval || "month";
		const intervalCount = parseInt(product.intervalCount || "1", 10);
		if (product.type === "recurring" || product.type === "fixed") {
			if (interval === "month")
				accessEnd.setMonth(accessEnd.getMonth() + intervalCount);
			else if (interval === "year")
				accessEnd.setFullYear(accessEnd.getFullYear() + intervalCount);
			else if (interval === "day")
				accessEnd.setDate(accessEnd.getDate() + intervalCount);
		}

		// Insert purchase
		await drizzleClient.insert(purchaseTable).values({
			id: s.id,
			userId,
			productId,
			stripeSessionId: s.id,
			stripeSubscriptionId: s.subscription,
			stripePaymentIntentId: s.payment_intent,
			accessStart: now,
			accessEnd,
			createdAt: now,
		});

		await markEventProcessed(event.id, event.type);
		return NextResponse.json({ received: true });
	}

	// Optionally handle other event types (e.g., invoice.paid for renewals)

	await markEventProcessed(event.id, event.type);
	return NextResponse.json({ received: true });
}
