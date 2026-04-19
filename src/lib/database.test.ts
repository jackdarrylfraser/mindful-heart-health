import { describe, it, expect } from "bun:test";
import { drizzleClient } from "@/src/lib/database"; // Ensure database module is imported to initialize connection

describe("Neon & Drizzle DB Integration Test", () => {
	it("Connect & Query PG DB", async () => {
		try {
			// Querying pg_catalog to ensure we are talking to a real Postgres instance
			const result = await drizzleClient.execute(`SELECT version();`);
			expect(result).toBeDefined();
			expect(result.rows[0].version).toContain("PostgreSQL");
		} catch (error) {
			throw new Error("Could not retrieve database version");
		}
	});
});
