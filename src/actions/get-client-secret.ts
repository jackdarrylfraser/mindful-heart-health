"use server";

import { stripe } from "@/src/lib/stripe";
import { z } from "zod";

// Zod schema for input validation
const GetClientSecretSchema = z.object({
	sessionId: z.string(),
});

/**
 * Server function to fetch the client secret for a given session ID.
 *
 * @param sessionId - The ID of the Stripe Checkout Session.
 * @returns The client secret for the Stripe Checkout Session.
 */
export async function getClientSecret(sessionId: string) {
	// Validate input
	GetClientSecretSchema.parse({ sessionId });

	try {
		// Retrieve the Checkout Session from Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

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
