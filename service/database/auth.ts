import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzleDb } from "@/service/database/database";
import * as schema from "@/service/database/schema";

export const auth = betterAuth({
    database: drizzleAdapter(drizzleDb, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: { enabled: true }
});