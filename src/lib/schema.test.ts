"use server";
import { describe, it, expect } from "bun:test";
import { getDrizzleClient } from "@/src/lib/database"; // Ensure database module is imported to initialize connection
import { sql } from "drizzle-orm";

describe("Better Auth Schema Integration", () => {
	const tableColumnMapping = {
		user: [
			"id",
			"name",
			"email",
			"email_verified",
			"image",
			"created_at",
			"updated_at",
		],
		session: [
			"id",
			"expires_at",
			"token",
			"created_at",
			"updated_at",
			"ip_address",
			"user_agent",
			"user_id",
		],
		account: [
			"id",
			"account_id",
			"provider_id",
			"user_id",
			"access_token",
			"refresh_token",
			"id_token",
			"access_token_expires_at",
			"refresh_token_expires_at",
			"scope",
			"password",
			"created_at",
			"updated_at",
		],
		verification: [
			"id",
			"identifier",
			"value",
			"expires_at",
			"created_at",
			"updated_at",
		],
	};

	Object.entries(tableColumnMapping).forEach(([tableName, columns]) => {
		it.each(columns)(
			`DB Verification -- Table:'${tableName}' column: '%s'`,
			async (columnName) => {
				const drizzleClient = await getDrizzleClient();
				const result = await drizzleClient.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = ${tableName} 
          AND column_name = ${columnName}
        );
      `);
				expect(result.rows[0].exists).toBe(true);
			},
		);
	});

	it("Foreign Key Relationship Verification: Session & User", async () => {
		// This checks that userId in the session table references the user table
		const drizzleClient = await getDrizzleClient();
		const result = await drizzleClient.execute(sql`
      SELECT count(*) as fk_count
      FROM information_schema.key_column_usage
      WHERE table_name = 'session' 
      AND column_name = 'user_id' 
      AND constraint_name = 'session_user_id_user_id_fk';
    `);

		const count = parseInt(result.rows[0].fk_count as string);
		expect(count).toBeGreaterThan(0);
	});

	it("Foreign Key Relationship Verification: Account & User", async () => {
		const drizzleClient = await getDrizzleClient();
		const result = await drizzleClient.execute(sql`
      SELECT count(*) as fk_count
      FROM information_schema.key_column_usage
      WHERE table_name = 'account' 
      AND column_name = 'user_id' 
      AND constraint_name = 'account_user_id_user_id_fk';
    `);

		const count = parseInt(result.rows[0].fk_count as string);
		expect(count).toBeGreaterThan(0);
	});
});
