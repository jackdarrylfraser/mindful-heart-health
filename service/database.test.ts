import { describe, it, expect } from "bun:test"; 
import sql from './database';

describe('Database Connection Integration Test', () => {
  it('should successfully connect to the database and execute a simple query', async () => {
    try {
      // Execute a simple query to verify connection and basic functionality
      const result = await sql`SELECT 1 as connection_test`;
      
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
      const result = await sql`SELECT version();`;
      expect(result).toBeDefined();
      expect(result[0].version).toContain('PostgreSQL');
    } catch (error) {
      throw new Error('Could not retrieve database version');
    }
  });
});
