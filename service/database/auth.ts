import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "@/service/database/client";
import * as schema from "@/service/database/schema";

export const auth = betterAuth({
    database: drizzleAdapter(database, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: { enabled: true }
});