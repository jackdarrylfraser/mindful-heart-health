"use server";

import { getStripe } from "@/src/lib/stripe";
import { z } from "zod";
import Stripe from "stripe";

const GetCheckoutSessionSchema = z.object({
	sessionId: z.string().min(1, "Session ID is required"),
});

export type CheckoutSessionResult = {
	status: Stripe.Checkout.Session["status"] | null;
	customerEmail: string | null;
};

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
