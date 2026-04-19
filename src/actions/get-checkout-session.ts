"use server";

import { stripe } from "@/src/lib/stripe";
import { z } from "zod";

const GetCheckoutSessionSchema = z.object({
	sessionId: z.string().min(1, "Session ID is required"),
});

export async function getCheckoutSession(sessionId: string) {
	// Validate input
	GetCheckoutSessionSchema.parse({ sessionId });

	const session = await stripe.checkout.sessions.retrieve(sessionId, {
		expand: ["line_items", "payment_intent"],
	});

	return {
		status: session.status,
		customerEmail: session.customer_details?.email ?? null,
	};
}
