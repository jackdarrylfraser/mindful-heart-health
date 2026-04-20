import { WelcomeEmail } from "../email/welcome";
import { getResend } from "../lib/email";

interface SendEmail {
	to: string;
	firstName: string;
	lastName: string;
	templateType: string;
}

export const sendEmail = async (emailData: SendEmail) => {
	const resend = await getResend();

	let emailTemplate, subject;

	if (emailData.templateType === "welcome") {
		emailTemplate = WelcomeEmail({
			firstName: emailData.firstName,
			lastName: emailData.lastName,
		});
		subject = "Welcome to Our Service!";
	} else {
		throw new Error("Unsupported email template type");
	}

	if (!emailTemplate || !subject) {
		return { success: false, error: "Missing email template or subject" };
	}

	const { data, error } = await resend.emails.send({
		from: "delivered@resend.dev",
		to: emailData.to,
		subject: subject,
		react: emailTemplate,
	});

	if (error) {
		console.error("[Email Service] Resend API Error:", error);
		return { success: false, error: error.message };
	}

	return { success: true, data };
};
