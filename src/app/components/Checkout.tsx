"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { getClientSecret } from "@/src/actions/checkout";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

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
