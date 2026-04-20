import { env } from "@/src/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/lib/schema.ts",
	out: "./migration",
	dbCredentials: {
		url: env.DATABASE_URL!,
	},
	schemaFilter: ["public"],
});
