import { getDrizzleClient } from "@/src/lib/database";
import { purchase, product, user } from "@/src/lib/schema";
import { authentication } from "@/src/service/authentication";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PurchasesPage() {
	const db = await getDrizzleClient();
	const session = await authentication.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	const purchases = await db
		.select()
		.from(purchase)
		.innerJoin(product, eq(purchase.productId, product.id))
		.where(eq(purchase.userId, session.user.id));

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-6">Your Purchases</h1>

			{purchases.length === 0 ? (
				<div className="bg-gray-50 border rounded-lg p-8 text-center">
					<p className="text-gray-500 mb-4">
						You haven't made any purchases yet.
					</p>
					<a
						href="/products"
						className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
					>
						Browse Products
					</a>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{purchases.map(({ purchase: p, product: prod }) => (
						<div
							key={p.id}
							className="border rounded-lg p-6 bg-white shadow-sm flex flex-col"
						>
							<h3 className="text-xl font-semibold mb-2">
								{prod.name}
							</h3>
							{prod.description && (
								<p className="text-gray-500 mb-4 flex-grow">
									{prod.description}
								</p>
							)}
							<div className="mt-auto space-y-2">
								<div className="text-sm border-t pt-4">
									<span className="text-gray-500">
										Purchased on:{" "}
									</span>
									<span className="font-medium">
										{new Date(
											p.createdAt,
										).toLocaleDateString()}
									</span>
								</div>
								<div className="text-sm">
									<span className="text-gray-500">
										Access valid until:{" "}
									</span>
									<span className="font-medium">
										{new Date(
											p.accessEnd,
										).toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
