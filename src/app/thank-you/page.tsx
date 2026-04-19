"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCheckoutSession } from "@/src/actions/get-checkout-session";

export default function ThankYou() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const sessionId = searchParams.get("session_id");

	const [status, setStatus] = useState<string | null>(null);
	const [customerEmail, setCustomerEmail] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!sessionId) {
			setError("Please provide a valid session_id (`cs_test_...`)");
			return;
		}

		let isMounted = true;

		async function fetchSession() {
			try {
				const sessionData = await getCheckoutSession(
					sessionId as string,
				);

				if (!isMounted) return;

				if (sessionData.status === "open") {
					router.push("/products");
					return;
				}

				setStatus(sessionData.status);
				setCustomerEmail(sessionData.customerEmail);
			} catch (err: any) {
				if (isMounted)
					setError(err.message || "Failed to load session details.");
			}
		}

		fetchSession();

		return () => {
			isMounted = false;
		};
	}, [sessionId, router]);

	if (error) {
		return <div className="p-4 text-red-500">{error}</div>;
	}

	if (!status) {
		return <div className="p-4">Loading order details...</div>;
	}

	if (status === "complete") {
		return (
			<main className="max-w-xl mx-auto py-8">
				<section id="success">
					<h1 className="text-2xl font-bold mb-4">
						Thank You for Your Purchase!
					</h1>
					<p>
						We appreciate your business! A confirmation email will
						be sent to {customerEmail ?? "your email address"}. If
						you have any questions, please email{" "}
						<a href="mailto:orders@example.com">
							orders@example.com
						</a>
						.
					</p>
				</section>
			</main>
		);
	}

	return null;
}
