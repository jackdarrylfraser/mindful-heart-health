import Stripe from "stripe";
import { env } from "@/src/lib/env";

if (!env.STRIPE_SECRET_KEY) {
	throw new Error(
		"STRIPE_SECRET_KEY is not defined in environment variables",
	);
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2026-03-25.dahlia", // Use the correct API version
});
