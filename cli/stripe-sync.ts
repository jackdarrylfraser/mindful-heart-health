import { syncStripeProductsToDb } from "@/src/service/stripe-sync";

export async function initStripeSync() {
	try {
		await syncStripeProductsToDb();
		// eslint-disable-next-line no-console
		console.log("[Stripe Sync] Products and prices synced successfully.");
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error("[Stripe Sync] Failed to sync products/prices:", err);
	}
}

// Optionally, trigger on import (for edge/serverless, use with care)
initStripeSync();
