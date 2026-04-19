import { defineConfig } from "drizzle-kit";
import { env } from "@/src/lib/env";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/lib/schema.ts",
	out: "./migration",
	dbCredentials: {
		url: env.DATABASE_URL!,
	},
	schemaFilter: ["public"],
});
