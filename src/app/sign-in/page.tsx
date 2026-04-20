"use client";
import { useState } from "react";
import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";
import { z } from "zod";
import { SignInSchema } from "@/src/lib/validation/zod-schema";
import { SignInForm } from "@/src/app/components/SignInForm";
import { SignInSuccess } from "@/src/app/components/SignInSuccess";

const authClient = createAuthClient({
	plugins: [magicLinkClient()],
});

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const validation = SignInSchema.safeParse({ email });
		if (!validation.success) {
			setError(validation.error.issues[0].message);
			setLoading(false);
			return;
		}

		try {
			const { error: authError } = await authClient.signIn.magicLink({
				email,
			});
			if (authError) {
				setError(authError.message || "Failed to send magic link.");
				return;
			}
			setIsSubmitted(true);
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	if (isSubmitted) {
		return <SignInSuccess email={email} />;
	}

	return (
		<SignInForm
			email={email}
			setEmail={setEmail}
			error={error}
			loading={loading}
			onSubmit={handleSubmit}
		/>
	);
}
