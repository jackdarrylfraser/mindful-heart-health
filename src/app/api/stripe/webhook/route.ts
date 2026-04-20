import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDrizzleClient } from "@/src/lib/database";
import {
	purchase as purchaseTable,
	product as productTable,
} from "@/src/lib/schema";
import { env } from "@/src/lib/env";
import { trackEvent } from "@/src/lib/analytics";

// 1. Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2026-03-25.dahlia",
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

	if (event.type === "checkout.session.completed") {
		const checkoutSession = event.data.object as Stripe.Checkout.Session;

		if (!checkoutSession.client_reference_id) {
			console.error("No client_reference_id found in session");
			return Response.json({ error: "Missing user ID" }, { status: 400 });
		}

		// Extract metadata we attached during checkout
		const productId = checkoutSession.metadata?.productId;

		if (!productId) {
			console.error("No productId found in metadata");
			return Response.json(
				{ error: "Missing product metadata" },
				{ status: 400 },
			);
		}

		// Insert purchase into the database
		const drizzleClient = await getDrizzleClient();
		await drizzleClient.insert(purchaseTable).values({
			id: crypto.randomUUID(),
			userId: checkoutSession.client_reference_id,
			productId,
			stripeSessionId: checkoutSession.id,
			accessEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year access
		});

		await trackEvent("Purchase Completed", {
			productId,
			valueCents: checkoutSession.amount_total || 0,
		});

		console.log(
			`Successfully processed purchase for user ${checkoutSession.client_reference_id}`,
		);
	}

	return NextResponse.json({ received: true });
}
