import { getStripe } from "@/src/lib/payments";
import { getDrizzleClient } from "@/src/lib/database";
import { product as productTable } from "@/src/lib/schema";

/**
 * Sync all Stripe products and prices into the local database.
 * - Pulls all active products and prices from Stripe.
 * - Upserts them into the product table.
 * - Sets isStripeSynced = true for all synced products.
 */
export async function syncStripeProductsToDb(): Promise<void> {
	const stripe = await getStripe();
	const products = await stripe.products.list({ active: true, limit: 100 });
	const prices = await stripe.prices.list({ active: true, limit: 100 });

	for (const product of products.data) {
		const price = prices.data.find(
			(p) => p.product === product.id && p.active,
		);
		if (!price) continue;

		const drizzleClient = await getDrizzleClient();
		await drizzleClient
			.insert(productTable)
			.values({
				id: product.id,
				name: product.name,
				description: product.description || "",
				priceCents: price.unit_amount?.toString() || "0",
				stripeProductId: product.id,
				stripePriceId: price.id,
				type: price.recurring ? "recurring" : "payment", // words stripe uses to determine type i.e. if it has recurring object it's a subscription, otherwise it's a one-time payment
				interval: price.recurring?.interval || null,
				intervalCount:
					price.recurring?.interval_count?.toString() || null,
				isStripeSynced: true,
				createdAt: product.created
					? new Date(product.created * 1000)
					: new Date(), // expect miliseconds
			})
			.onConflictDoUpdate({
				target: productTable.id,
				set: {
					name: product.name,
					description: product.description || "",
					priceCents: price.unit_amount?.toString() || "0",
					stripeProductId: product.id,
					stripePriceId: price.id,
					type: price.recurring ? "recurring" : "payment", // words stripe uses to determine type i.e. if it has recurring object it's a subscription, otherwise it's a one-time payment
					interval: price.recurring?.interval || null,
					intervalCount:
						price.recurring?.interval_count?.toString() || null,
					isStripeSynced: true,
				},
			});
	}
}
