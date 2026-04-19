import Stripe from "stripe";
import { env } from "@/src/lib/env";

let _stripe: Stripe | undefined;

export async function getStripe() {
	if (!_stripe) {
		_stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: "2026-03-25.dahlia", // Use the correct API version
		});
	}
	return _stripe;
}
