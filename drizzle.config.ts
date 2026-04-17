import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./service/schema.ts", 
  out: "./migration",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // crucial for Neon Auth
  schemaFilter: ["public", "neon_auth"], 
});