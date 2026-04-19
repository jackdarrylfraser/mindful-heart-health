import { mock } from "bun:test";

mock.module("@/src/lib/env", () => ({
	env: {
		DATABASE_URL:
			"postgresql://neondb_owner:npg_wkvuq0hGpg2X@ep-curly-fog-ans0ntfn-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",

		STRIPE_SECRET_KEY: "sk_test_12345",
		STRIPE_WEBHOOK_SECRET: "whsec_test_12345",
		RESEND_API_KEY: "re_12345",
		BETTER_AUTH_URL: "http://localhost:3000/api/auth",

		NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_12345",
	},
}));
