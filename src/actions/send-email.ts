"use server";

import { Resend } from "resend";
import { WelcomeEmail } from "@/src/email/welcome";
import { MagicLinkEmail } from "@/src/email/MagicLinkEmail";
import { z } from "zod";
import { env } from "@/src/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

const sendMagicLinkSchema = z.object({
	email: z.string().email(),
	url: z.string().url(),
});

export async function handleContactForm(formData: FormData) {
	const firstName = formData.get("first_name") as string;
	const lastName = formData.get("last_name") as string;
	const email = formData.get("email") as string;

	const { data, error } = await resend.emails.send({
		from: "delivered@resend.dev",
		to: email,
		subject: "Welcome!",
		react: WelcomeEmail({ firstName, lastName }),
	});

	if (error) return { success: false };
	return { success: true };
}

export async function sendMagicLink(input: { email: string; url: string }) {
	const parse = sendMagicLinkSchema.safeParse(input);
	if (!parse.success) {
		return { success: false, error: "Invalid input" };
	}
	const { email, url } = parse.data;
	const { data, error } = await resend.emails.send({
		from: "login@healthy-blood-pressure.com",
		to: email,
		subject: "Your Magic Sign-In Link",
		react: MagicLinkEmail({ email, url }),
	});
	if (error) return { success: false, error };
	return { success: true };
}
