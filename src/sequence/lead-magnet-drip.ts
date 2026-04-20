import { eventType } from "inngest";
import { getInngest } from "@/src/lib/sequence";
import { getResend } from "@/src/lib/email";
import { z } from "zod";

const inngest = await getInngest();

export const emailDripSequence = inngest.createFunction(
	{
		id: "lead-magnet-drip",
		name: "5-Day Lead Magnet Drip Sequence",
		triggers: [
			eventType("app/lead.captured", {
				schema: z.object({
					email: z.email(),
					firstName: z.string().min(1).max(100),
					source: z.string().max(100),
				}),
			}),
		],
	},
	async ({ event, step }) => {
		const resend = await getResend();

		const { email } = event.data;

		// STEP 1: Deliver exactly what they asked for immediately.
		await step.run("send-lead-magnet", async () => {
			console.log(`Sending Lead Magnet PDF to ${email}...`);
			// TODO: Wrap this in actual resend.emails.send() using your true template
		});

		// STEP 2: The magic of orchestration -> Tell Vercel to sleep for exactly 48 hours.
		// Inngest servers will wake your app back up directly to Step 3.
		await step.sleep("wait-two-days", "2d");

		// STEP 3: The Check-in
		await step.run("send-day-two-checkin", async () => {
			console.log(`Sending Day 2 Check-in to ${email}...`);
			// TODO: resend.emails.send() using a soft, text-focused React Email
		});

		// STEP 4: Sleep for 3 days
		await step.sleep("wait-three-days", "3d");

		// STEP 5: The Cohort Upsell
		await step.run("send-cohort-upsell", async () => {
			console.log(`Sending Cohort Upsell to ${email}...`);
			// TODO: The Sales Pitch email template
		});
	},
);
