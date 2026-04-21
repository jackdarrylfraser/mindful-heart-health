"use server";

import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "@/src/lib/env";

let _client: NeonHttpDatabase | undefined;

export async function getDrizzleClient() {
	if (!_client) {
		const neonClient = neon(env.DATABASE_URL);
		_client = drizzle(neonClient, {});
	}
	return _client;
}
