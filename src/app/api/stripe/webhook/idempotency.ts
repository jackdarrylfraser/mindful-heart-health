import { drizzleClient } from "@/src/lib/database";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

export const stripeEvent = pgTable("stripe_event", {
	id: text("id").primaryKey(), // Stripe event ID
	type: text("type").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export async function isEventProcessed(eventId: string): Promise<boolean> {
	const [existing] = await drizzleClient
		.select()
		.from(stripeEvent)
		.where(eq(stripeEvent.id, eventId));
	return !!existing;
}

export async function markEventProcessed(eventId: string, type: string) {
	await drizzleClient.insert(stripeEvent).values({ id: eventId, type });
}
