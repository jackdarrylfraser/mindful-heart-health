import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { drizzleClient } from "@/lib/database";
import { purchase as purchaseTable, product as productTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const buf = await req.arrayBuffer();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
  }

  // Handle event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const productId = session.metadata?.productId;
    if (!userId || !productId) return NextResponse.json({ error: "Missing metadata" }, { status: 400 });

    // Look up product for interval
    const [product] = await drizzleClient.select().from(productTable).where(eq(productTable.id, productId));
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Calculate access window
    const now = new Date();
    let accessEnd = new Date(now);
    if (product.type === "recurring") {
      const interval = product.interval || "month";
      const intervalCount = parseInt(product.intervalCount || "1", 10);
      if (interval === "month") accessEnd.setMonth(accessEnd.getMonth() + intervalCount);
      else if (interval === "year") accessEnd.setFullYear(accessEnd.getFullYear() + intervalCount);
      else if (interval === "day") accessEnd.setDate(accessEnd.getDate() + intervalCount);
    } else {
      // Fixed duration
      const interval = product.interval || "month";
      const intervalCount = parseInt(product.intervalCount || "1", 10);
      if (interval === "month") accessEnd.setMonth(accessEnd.getMonth() + intervalCount);
      else if (interval === "year") accessEnd.setFullYear(accessEnd.getFullYear() + intervalCount);
      else if (interval === "day") accessEnd.setDate(accessEnd.getDate() + intervalCount);
    }

    // Insert purchase
    await drizzleClient.insert(purchaseTable).values({
      id: session.id,
      userId,
      productId,
      stripeSessionId: session.id,
      stripeSubscriptionId: session.subscription as string | undefined,
      stripePaymentIntentId: session.payment_intent as string | undefined,
      accessStart: now,
      accessEnd,
      createdAt: now,
    });
  }

  // Optionally handle other event types (e.g., invoice.paid for renewals)

  return NextResponse.json({ received: true });
}
