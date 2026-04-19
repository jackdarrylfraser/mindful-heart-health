"use client";
import React from "react";
import { handleContactForm } from "@/src/actions/send-email";

export function ContactForm() {
	const [status, setStatus] = React.useState<string | null>(null);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus(null);
		const formData = new FormData(e.currentTarget);
		const res = await handleContactForm(formData);
		if (res?.success) {
			setStatus("Thank you! Check your email.");
			e.currentTarget.reset();
		} else {
			setStatus("Something went wrong. Please try again.");
		}
	}

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col gap-4 max-w-md mx-auto my-8 p-4 border rounded bg-white"
		>
			<input
				name="first_name"
				placeholder="First Name"
				required
				className="p-2 border rounded"
			/>
			<input
				name="last_name"
				placeholder="Last Name"
				required
				className="p-2 border rounded"
			/>
			<input
				name="email"
				type="email"
				placeholder="Email"
				required
				className="p-2 border rounded"
			/>
			<button
				type="submit"
				className="bg-blue-600 text-white p-2 rounded"
			>
				Sign Up
			</button>
			{status && <div className="text-center text-sm mt-2">{status}</div>}
		</form>
	);
}
