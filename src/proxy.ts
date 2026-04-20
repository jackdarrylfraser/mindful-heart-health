import { NextRequest, NextResponse } from "next/server";
import { authentication } from "@/src/service/authentication";
import { getDrizzleClient } from "@/src/lib/database";
import {
	purchase as purchaseTable,
	product as productTable,
} from "@/src/lib/schema";
import { eq, and, gt } from "drizzle-orm";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Get session
	const session = await authentication.api.getSession({
		headers: request.headers,
	});

	if (!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	// Extract the product ID using a regular expression for robust path parsing
	const match = pathname.match(/^\/(?:modules|cohort)\/([^/]+)/);
	const productId = match?.[1];

	if (!productId) return NextResponse.next(); // Invalid path structure, allow to handle 404

	const db = await getDrizzleClient();
	const result = await db
		.select()
		.from(purchaseTable)
		.innerJoin(productTable, eq(purchaseTable.productId, productTable.id))
		.where(
			and(
				eq(purchaseTable.userId, session.user.id),
				eq(productTable.id, productId),
				gt(purchaseTable.accessEnd, new Date()),
			),
		);

	if (!result.length) {
		return NextResponse.redirect(new URL("/products", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/modules/:path*", "/cohort/:path*"],
};
