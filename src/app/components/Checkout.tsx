"use client";

import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

import { getClientSecret } from "@/src/actions/get-client-secret";
import { env } from "@/src/lib/env";

if (!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error(
		"NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables",
	);
}

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");

	if (!sessionId) {
		return <div>Missing session_id in URL.</div>;
	}

	const fetchClientSecret = async () => {
		try {
			const { clientSecret } = await getClientSecret(sessionId);
			return clientSecret;
		} catch (error) {
			console.error("Failed to fetch client secret:", error);
			throw new Error("Unable to load checkout session.");
		}
	};

	return (
		<div id="checkout">
			<EmbeddedCheckoutProvider
				stripe={stripePromise}
				options={{ fetchClientSecret }}
			>
				<EmbeddedCheckout />
			</EmbeddedCheckoutProvider>
		</div>
	);
}
