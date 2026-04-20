import umami from "@umami/node";
import { env } from "@/src/lib/env";

// Initialize umami tracking instance
// We use the same self-hosted URL and website ID as the client script
if (env.NEXT_PUBLIC_UMAMI_URL && env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
	umami.init({
		websiteId: env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
		hostUrl: env.NEXT_PUBLIC_UMAMI_URL,
	});
}

// Wrapper for safe tracking that won't throw if env vars are missing
export const trackEvent = async (
	eventValue: string,
	eventData?: Record<string, string | number>,
) => {
	if (!env.NEXT_PUBLIC_UMAMI_URL || !env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
		console.warn(
			"Umami environment variables missing. Event tracked locally:",
			{ eventValue, eventData },
		);
		return;
	}

	try {
		// If doing this server-side natively from a request context you might need headers/IP usually
		// But @umami/node handles basic non-browser reporting easily
		await umami.track(eventValue, eventData);
	} catch (error) {
		console.error("Failed to track event to Umami:", error);
	}
};
