import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzleDb } from "@/service/database";
import * as schema from "@/migration/schema";

export const auth = betterAuth({
    database: drizzleAdapter(drizzleDb, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: { enabled: true }
});