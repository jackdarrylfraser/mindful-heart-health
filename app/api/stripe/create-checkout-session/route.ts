// this is over complicated
// don't use
// look at the next.js stripe documentation
// and write something like that
// it should be a action for checkout
// and a api webhook for handling any recurring invoices of offical payment processing









import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { drizzleClient } from "@/lib/database";
import { product as productTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { productId, userId } = await req.json();
  if (!productId || !userId) {
    return NextResponse.json({ error: "Missing productId or userId" }, { status: 400 });
  }

  // Look up product in DB
  const [product] = await drizzleClient.select().from(productTable).where(eq(productTable.id, productId));
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let session;
  if (product.type === "recurring") {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: undefined, // Optionally pass user's email
      metadata: { userId, productId },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });
  } else {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: undefined, // Optionally pass user's email
      metadata: { userId, productId },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });
  }

  return NextResponse.json({ url: session.url });
}
