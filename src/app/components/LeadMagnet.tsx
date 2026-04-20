"use client";

import { sendLeadMagnet } from "@/src/actions/send-lead-magnet";
import { useActionState } from "react";

interface LeadMagnetFormProps {
	source: string;
	buttonText?: string;
	onSuccessMessage?: string;
	templateType: string;
}

export function LeadMagnet({
	source,
	buttonText = "Send it to me",
	onSuccessMessage = "Check your email for the resource!",
	templateType,
}: LeadMagnetFormProps) {
	const [state, formAction, isPending] = useActionState(sendLeadMagnet, null);

	if (state?.success) {
		return (
			<div className="rounded-md bg-green-50 p-4 border border-green-200">
				<p className="text-sm font-medium text-green-800">
					{onSuccessMessage}
				</p>
			</div>
		);
	}

	return (
		<form action={formAction} className="space-y-4 max-w-sm w-full">
			{/* Hidden input to pass the source transparently to the server */}
			<input type="hidden" name="source" value={source} />
			<input type="hidden" name="templateType" value={templateType} />

			<div>
				<label
					htmlFor="firstName"
					className="block text-sm font-medium text-gray-700"
				>
					First Name
				</label>
				<input
					type="text"
					name="firstName"
					id="firstName"
					autoComplete="given-name"
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
				/>
			</div>
			<div>
				<label
					htmlFor="lastName"
					className="block text-sm font-medium text-gray-700"
				>
					Last Name
				</label>
				<input
					type="text"
					name="lastName"
					id="lastName"
					autoComplete="family-name"
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
				/>
			</div>

			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Email Address
				</label>
				<input
					type="email"
					name="email"
					id="email"
					autoComplete="email"
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
				/>
				{state?.error && (
					<p className="mt-1 text-sm text-red-600">{state.error}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isPending}
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
			>
				{isPending ? "Sending..." : buttonText}
			</button>
		</form>
	);
}
