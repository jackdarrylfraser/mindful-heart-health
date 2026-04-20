"use server";
import { WelcomeEmail } from "@/src/email/welcome";
import { getResend } from "@/src/lib/email";
import { SendEmailWithReactBodySchema } from "@/src/lib/validation/zod-schema";
import { lead as leadTable } from "@/src/lib/schema";
import { getDrizzleClient } from "@/src/lib/database";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { sendEmail } from "../service/mail";

const resend = await getResend();

export async function sendLeadMagnet(prevState: any, formData: FormData) {
	const rawData = Object.fromEntries(formData.entries());

	console.log("Validation result:", rawData);
	const validation = SendEmailWithReactBodySchema.parse(rawData);

	// use headers to lookup session and get the users first and last name

	const db = await getDrizzleClient();

	// Check if lead already exists
	const existing = await db
		.select()
		.from(leadTable)
		.where(eq(leadTable.email, validation.email));

	if (!existing.length) {
		await db.insert(leadTable).values({
			id: randomUUID(),
			email: validation.email,
			firstName: validation.firstName,
			lastName: validation.lastName,
			source: validation.source,
		});
	}

	const { success, error } = await sendEmail({
		to: validation.email,
		templateType: validation.templateType,
		firstName: validation.firstName,
		lastName: validation.lastName,
	});

	if (error) return { success: false, error: "Failed to send email" };
	return { success };
}
