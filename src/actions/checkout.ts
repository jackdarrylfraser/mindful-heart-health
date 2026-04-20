"use server";

import { getStripe } from "@/src/lib/payments";
import { getDrizzleClient } from "@/src/lib/database";
import { product as productTable } from "@/src/lib/schema";
import { eq } from "drizzle-orm";
import { env } from "@/src/lib/env";
import { z } from "zod";
import Stripe from "stripe";
import {
	CreateStripeCheckoutSession,
	GetCheckoutSessionSchema,
	GetClientSecretSchema,
} from "../lib/validation/zod-schema";

export type CheckoutSessionResult = {
	status: Stripe.Checkout.Session["status"] | null;
	customerEmail: string | null;
};

// --- Actions ---

/**
 * Server function to fetch the client secret for a given session ID.
 */
export async function getClientSecret(sessionId: string) {
	const parsed = GetClientSecretSchema.parse({ sessionId });

	try {
		const stripe = await getStripe();
		const session = await stripe.checkout.sessions.retrieve(
			parsed.sessionId,
		);

		if (!session.client_secret) {
			throw new Error(
				"Client secret not found for the given session ID.",
			);
		}

		return { clientSecret: session.client_secret };
	} catch (error) {
		console.error("Error fetching client secret:", error);
		throw new Error("Failed to retrieve client secret.");
	}
}

/**
 * Retrieves the Stripe checkout session details.
 */
export async function getCheckoutSession(
	sessionId: string,
): Promise<CheckoutSessionResult> {
	try {
		const parsed = GetCheckoutSessionSchema.parse({ sessionId });
		const stripe = await getStripe();

		const session = await stripe.checkout.sessions.retrieve(
			parsed.sessionId,
			{
				expand: ["line_items", "payment_intent"],
			},
		);

		return {
			status: session.status,
			customerEmail: session.customer_details?.email ?? null,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(
				`Validation Error: ${error.issues.map((e) => e.message).join(", ")}`,
			);
		}
		if (error instanceof Stripe.errors.StripeError) {
			throw new Error(`Stripe API Error: ${error.message}`);
		}
		throw new Error(
			"An unexpected error occurred while retrieving the session.",
		);
	}
}

/**
 * Server Action: Create a Stripe Checkout Session for a single product.
 */
export async function createStripeCheckoutSession(
	formData: FormData,
): Promise<{ sessionId: string }> {
	const parsed = CreateStripeCheckoutSession.parse(formData);

	const drizzleClient = await getDrizzleClient();

	const [product] = await drizzleClient
		.select()
		.from(productTable)
		.where(eq(productTable.id, parsed.productId));

	if (!product) throw new Error("Product not found");

	if (!env.NEXT_PUBLIC_BASE_URL) {
		throw new Error(
			"NEXT_PUBLIC_BASE_URL is not defined in environment variables",
		);
	}

	const stripe = await getStripe();
	const session = await stripe.checkout.sessions.create({
		ui_mode: "embedded_page",
		mode: product.type === "recurring" ? "subscription" : "payment",
		line_items: [
			{
				price: product.stripePriceId,
				quantity: 1,
			},
		],
		return_url: `${env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
		metadata: {
			productId: parsed.productId,
			userId: parsed.userId || "guest",
		},
	});

	if (!session.client_secret) {
		throw new Error("Failed to create checkout session");
	}

	return { sessionId: session.id };
}
