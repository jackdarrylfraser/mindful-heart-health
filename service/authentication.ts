import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzleClient } from "@/lib/database";
import * as schema from "@/lib/schema";

export const authentication = betterAuth({
    database: drizzleAdapter(drizzleClient, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: { enabled: true }
});