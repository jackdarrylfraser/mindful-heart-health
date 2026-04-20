import { NextResponse } from "next/server";
import { env } from "../../../lib/env";

export async function GET(request: Request) {
	// 1. Security Check: Ensure the request comes exactly from Vercel's Cron infrastructure
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// 2. Execute Jobs (Import from src/jobs/* to keep this file purely as a router)
		console.log("[CRON] Starting daily background jobs...");

		// e.g., await syncStripePlans();
		// e.g., await sendEmailSequences();

		console.log("[CRON] Jobs completed successfully.");
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[CRON] Failed to execute jobs:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
