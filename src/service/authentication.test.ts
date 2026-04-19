import { describe, it, expect } from "bun:test";
import { authentication } from "@/src/service/authentication";

describe("Better Auth Adapter Integration", () => {
	it("should be initialized with the correct API structure", () => {
		expect(authentication).toBeDefined();
		expect(authentication.api).toBeDefined();
		expect(typeof authentication.handler).toBe("function");
	});

	it("should successfully connect to the database via the Drizzle adapter", async () => {
		// We attempt to fetch a session with empty headers.
		// This triggers a database query to the 'session' table.
		// If the configuration is correct (adapter, database connection, and schema),
		// it will return null (no session found) rather than throwing an error.
		try {
			const result = await authentication.api.getSession({
				headers: new Headers(),
			});
			expect(result).toBeNull();
		} catch (error) {
			throw new Error(
				`Better Auth database connection failed: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	});
});
