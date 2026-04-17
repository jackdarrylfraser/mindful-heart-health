import { describe, it, expect } from "bun:test"; 
import { neonSql, drizzleDb } from "./database";
import { sql } from "drizzle-orm";

describe("Drizzle ORM Integration", () => {
  it("should successfully execute a query using the drizzle instance", async () => {
    // Using a raw SQL fragment through Drizzle to verify connection 
    // without requiring the 'users' table to be migrated yet.
    const result = await drizzleDb.execute(sql`SELECT 1 as health_check`);

    expect(result).toBeDefined();
    expect(result.rows[0].health_check).toBe(1);
  });
});

describe('DB Connection Integration Test', () => {
  it('should successfully connect to the database and execute a simple query', async () => {
    try {
      // Execute a simple query to verify connection and basic functionality
      const result = await neonSql`SELECT 1 as connection_test`;
      
      // Assert that the result is what we expect
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].connection_test).toBe(1);
    } catch (error) {
      // If the connection fails, the test should fail with a descriptive message
      console.error('Database connection failed:', error);
      throw new Error(`Failed to connect to the database: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  it('should be able to query system tables', async () => {
    try {
      // Querying pg_catalog to ensure we are talking to a real Postgres instance
      const result = await neonSql`SELECT version();`;
      expect(result).toBeDefined();
      expect(result[0].version).toContain('PostgreSQL');
    } catch (error) {
      throw new Error('Could not retrieve database version');
    }
  });
});
