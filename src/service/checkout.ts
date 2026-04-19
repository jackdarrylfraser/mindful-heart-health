import { getDrizzleClient } from "@/src/lib/database";
import { cart as cartTable, product as productTable } from "@/src/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { getStripe } from "@/src/lib/stripe";
import { env } from "@/src/lib/env";

/**
 * Creates a Stripe Checkout Session for the current cart, handling upsell and Stripe sync.
 * - If 2+ payment products, upsell all-access subscription if available.
 * - Ensures all products are Stripe-synced before checkout.
 * - Returns the Stripe session client_secret for Embedded Checkout.
 */
export async function checkoutCart({
	cartId,
	email,
}: {
	cartId: string;
	email: string;
}): Promise<string> {
	// 1. Get cart and products
	const drizzleClient = await getDrizzleClient();
	const [cart] = await drizzleClient
		.select()
		.from(cartTable)
		.where(eq(cartTable.id, cartId));
	if (!cart || !cart.productIds.length) throw new Error("Cart is empty");
	let products = await drizzleClient
		.select()
		.from(productTable)
		.where(inArray(productTable.id, cart.productIds));

	// 2. Ensure all products are Stripe-synced
	for (const product of products) {
		if (!product.isStripeSynced) {
			throw new Error(`Product ${product.id} not Stripe-synced`);
		}
	}

	// 3. Build line items
	const line_items = products.map((p) => ({
		price: p.stripePriceId,
		quantity: 1,
	}));

	// 4. Create Stripe Checkout Session (embedded)
	const stripe = await getStripe();
	const session = await stripe.checkout.sessions.create({
		ui_mode: "embedded_page",
		mode: products[0].type === "recurring" ? "subscription" : "payment",
		customer_email: email,
		line_items,
		metadata: { cartId },
		success_url: `${env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/cancel`,
	});

	return session.client_secret!;
}
