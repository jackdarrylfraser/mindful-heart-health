"use server";
import { checkoutCart } from "@/src/service/checkout";

/**
 * Server action for EmbeddedCheckoutProvider. Returns Stripe client_secret for the cart.
 * Accepts: { cartId: string, email: string, upsellAllAccess?: boolean }
 */
export async function fetchClientSecret({
	cartId,
	email,
}: {
	cartId: string;
	email: string;
}): Promise<string> {
	return checkoutCart({ cartId, email });
}
