export function SignInSuccess({ email }: { email: string }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="w-full max-w-sm p-8 bg-white rounded shadow text-center">
				<h1 className="mb-4 text-2xl font-bold">Check your email</h1>
				<p className="text-gray-600">
					A magic link has been sent to <strong>{email}</strong>.
					Click the link in the email to sign in.
				</p>
			</div>
		</div>
	);
}
