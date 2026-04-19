import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDrizzleClient } from "@/src/lib/database";
import * as schema from "@/src/lib/schema";
import { sendMagicLink } from "@/src/actions/send-email";
import { magicLink } from "better-auth/plugins";

export const authentication = betterAuth({
	database: drizzleAdapter(await getDrizzleClient(), {
		provider: "pg",
		schema: schema,
	}),
	plugins: [
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await sendMagicLink({ email, url });
			},
		}),
	],
});
