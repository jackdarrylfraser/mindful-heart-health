"use server";
import { stripe } from "@/src/lib/stripe";
import { drizzleClient } from "@/src/lib/database";
import { product as productTable } from "@/src/lib/schema";
import { eq } from "drizzle-orm";
import { env } from "@/src/lib/env";

/**
 * Server Action: Create a Stripe Checkout Session for a single product.
 * Accepts: { productId: string, userId?: string }
 * Returns: { url: string } | throws
 */
export async function createStripeCheckoutSession(
	formData: FormData,
): Promise<{ sessionId: string }> {
	const productId = formData.get("productId") as string;
	const userId = formData.get("userId") as string | undefined;
	if (!productId) throw new Error("Missing productId");

	const [product] = await drizzleClient
		.select()
		.from(productTable)
		.where(eq(productTable.id, productId));

	if (!product) throw new Error("Product not found");

	if (!env.NEXT_PUBLIC_BASE_URL) {
		throw new Error(
			"NEXT_PUBLIC_BASE_URL is not defined in environment variables",
		);
	}

	const session = await stripe.checkout.sessions.create({
		ui_mode: "embedded_page",
		mode: product.type === "recurring" ? "subscription" : "payment",
		line_items: [
			{
				price: product.stripePriceId,
				quantity: 1,
			},
		],
		customer: userId || undefined,
		return_url: `${env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
		metadata: {
			productId: productId,
			userId: userId || "guest",
		},
	});

	return { sessionId: session.id };
}
