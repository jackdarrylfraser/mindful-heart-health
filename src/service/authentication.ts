import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDrizzleClient } from "@/src/lib/database";
import * as schema from "@/src/lib/schema";
import { magicLink } from "better-auth/plugins";
import { getResend } from "@/src/lib/email";
import { MagicLinkEmail } from "@/src/email/MagicLinkEmail";

export const authentication = betterAuth({
	database: drizzleAdapter(await getDrizzleClient(), {
		provider: "pg",
		schema: schema,
	}),
	plugins: [
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				const resend = await getResend();

				const { data, error } = await resend.emails.send({
					from: "delivered@resend.dev",
					to: email,
					subject: "Your Magic Sign-In Link",
					react: MagicLinkEmail({ email, url }),
				});
			},
		}),
	],
});
