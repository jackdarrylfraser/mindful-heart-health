import { z } from "zod";

export const LeadFormSchema = z.object({
	email: z.string().email("Invalid email address"),
	firstName: z.string().min(1, "First name is required").optional(),
	source: z.string().nonempty("Source is required"),
});

export const CreateStripeCheckoutSession = z.object({
	productId: z.string().min(1, "Product ID is required"),
	userId: z.string().min(1, "User ID is required"),
});

// Forms
export const SignInSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
});

// Server Actions
export const GetCheckoutSessionSchema = z.object({
	sessionId: z.string().min(1, "Session ID is required"),
});

export const GetClientSecretSchema = z.object({
	sessionId: z.string().min(1, "Session ID is required"),
});

// Webhook
export const StripeWebhookPayloadSchema = z.object({
	type: z.string(),
	data: z.object({
		object: z
			.object({
				id: z.string(),
				customer: z.string().nullable().optional(),
				status: z.string().nullable().optional(),
			})
			.passthrough(),
	}),
});

// email
export const SendEmailWithReactBodySchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.email("Invalid recipient email address"),
	templateType: z.string().min(1, "Template type is required"),
	source: z.string().min(1, "Source is required"),
});
