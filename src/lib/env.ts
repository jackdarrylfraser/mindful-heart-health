import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
	server: {
		// These are only available on the server
		DATABASE_URL: z.string().min(1, "DATABASE_URL cannot be empty"),
		CRON_SECRET: z
			.string()
			.min(1, "CRON_SECRET is required to secure Vercel Cron jobs"),
		RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY cannot be empty"),
		STRIPE_SECRET_KEY: z
			.string()
			.min(1, "STRIPE_SECRET_KEY cannot be empty"),
		STRIPE_WEBHOOK_SECRET: z
			.string()
			.min(1, "STRIPE_WEBHOOK_SECRET cannot be empty"),
		BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL cannot be empty"),
	},
	client: {
		// These MUST start with NEXT_PUBLIC_
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
			.string()
			.min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY cannot be empty"),
		NEXT_PUBLIC_BASE_URL: z
			.string()
			.min(1, "NEXT_PUBLIC_BASE_URL cannot be empty"),
		NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
	},
	// This tells the library which variables to check in the runtime
	runtimeEnv: {
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		CRON_SECRET: process.env.CRON_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
	},
});
