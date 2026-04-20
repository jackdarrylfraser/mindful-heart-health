interface SignInFormProps {
	email: string;
	setEmail: (email: string) => void;
	error: string | null;
	loading: boolean;
	onSubmit: (e: React.FormEvent) => void;
}

export function SignInForm({
	email,
	setEmail,
	error,
	loading,
	onSubmit,
}: SignInFormProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<form
				onSubmit={onSubmit}
				className="w-full max-w-sm p-8 bg-white rounded shadow"
			>
				<h1 className="mb-6 text-2xl font-bold text-center">Sign In</h1>
				<input
					type="email"
					placeholder="Email address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="w-full px-3 py-2 mb-4 border rounded"
				/>
				{error && (
					<div className="mb-4 text-red-500 text-sm">{error}</div>
				)}
				<button
					type="submit"
					disabled={loading}
					className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Sending..." : "Send Magic Link"}
				</button>
			</form>
		</div>
	);
}
