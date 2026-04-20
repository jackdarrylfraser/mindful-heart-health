"use client";

import { useTransition } from "react";
import { createStripeCheckoutSession } from "@/src/actions/checkout";

interface CheckoutButtonProps {
	productId: string;
	userId: string;
}

export default function CheckoutButton({
	productId,
	userId,
}: CheckoutButtonProps) {
	const [pending, startTransition] = useTransition();

	async function action(formData: FormData) {
		const result = await createStripeCheckoutSession(formData);
		if (result?.sessionId) {
			window.location.href = `/checkout?session_id=${encodeURIComponent(result.sessionId)}`;
		} else {
			alert("Failed to start checkout.");
		}
	}

	return (
		<form action={action} className="inline">
			<input type="hidden" name="productId" value={productId} />
			<input type="hidden" name="userId" value={userId} />
			<button
				type="submit"
				disabled={pending}
				className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
			>
				{"Buy Now"}
			</button>
		</form>
	);
}
