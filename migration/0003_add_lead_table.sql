CREATE TABLE "lead" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"source" text NOT NULL,
	"converted_to_user" boolean DEFAULT false NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lead_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cart" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "cart" CASCADE;--> statement-breakpoint
ALTER TABLE "lead" ADD CONSTRAINT "lead_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "purchase_productId_idx" ON "purchase" USING btree ("product_id");--> statement-breakpoint
ALTER TABLE "purchase" DROP COLUMN "stripe_subscription_id";--> statement-breakpoint
ALTER TABLE "purchase" DROP COLUMN "stripe_payment_intent_id";--> statement-breakpoint
ALTER TABLE "purchase" DROP COLUMN "access_start";