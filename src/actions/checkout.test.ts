import { describe, expect, it, mock, beforeEach } from "bun:test";
import { getCheckoutSession } from "./checkout";

// Create the mock stripe instance
const mockStripe = {
	checkout: {
		sessions: {
			retrieve: mock(async () => ({})),
		},
	},
};

// Mock the getStripe function directly
mock.module("@/src/lib/stripe", () => ({
	getStripe: async () => mockStripe,
}));

describe("getCheckoutSession", () => {
	beforeEach(() => {
		// Clear mocks before each test
		mockStripe.checkout.sessions.retrieve.mockClear();
	});

	it("should throw a validation error if sessionId is empty", async () => {
		expect(getCheckoutSession("")).rejects.toThrow(
			"Validation Error: Session ID is required",
		);
	});

	it("should retrieve a session and return status and customerEmail", async () => {
		const mockSessionId = "cs_test_12345";
		const mockResponse = {
			status: "complete",
			customer_details: { email: "test@example.com" },
		};

		mockStripe.checkout.sessions.retrieve.mockResolvedValueOnce(
			mockResponse,
		);

		const result = await getCheckoutSession(mockSessionId);

		expect(mockStripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
			mockSessionId,
			{
				expand: ["line_items", "payment_intent"],
			},
		);
		expect(result).toEqual({
			status: "complete",
			customerEmail: "test@example.com",
		});
	});

	it("should handle null customer email gracefully", async () => {
		const mockSessionId = "cs_test_12345";
		const mockResponse = {
			status: "open",
			customer_details: { email: null },
		};

		mockStripe.checkout.sessions.retrieve.mockResolvedValueOnce(
			mockResponse,
		);

		const result = await getCheckoutSession(mockSessionId);
		expect(result).toEqual({ status: "open", customerEmail: null });
	});

	it("should throw an error when the Stripe API fails", async () => {
		const mockSessionId = "cs_test_invalid";

		// Create an error that looks enough like a Stripe error, or just throw it.
		// The error handling inside falls back to the generic message if not a Stripe.errors.StripeError
		mockStripe.checkout.sessions.retrieve.mockRejectedValueOnce(
			new Error("No such checkout.session: 'cs_test_invalid'"),
		);

		expect(getCheckoutSession(mockSessionId)).rejects.toThrow(
			"An unexpected error occurred while retrieving the session.",
		);
	});
});
