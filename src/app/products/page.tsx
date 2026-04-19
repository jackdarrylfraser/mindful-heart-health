import { drizzleClient } from "@/src/lib/database";
import { product as productTable } from "@/src/lib/schema";
import StripeCheckoutButton from "@/src/app/components/StripeCheckoutButton";

async function getProducts() {
	return drizzleClient.select().from(productTable);
}

export default async function ProductsPage() {
	const products = await getProducts();
	return (
		<main className="max-w-xl mx-auto py-8">
			<h1 className="text-2xl font-bold mb-4">Products</h1>
			<ul className="space-y-4">
				{products.map((p) => (
					<li
						key={p.id}
						className="border rounded p-4 flex items-center justify-between"
					>
						<div>
							<div className="font-semibold">{p.name}</div>
							<div className="text-sm text-gray-500">
								{p.description}
							</div>
							<div className="text-sm text-gray-700 mt-1">
								{Number(p.priceCents) / 100} USD
							</div>
						</div>
						<StripeCheckoutButton productId={p.id} userId="" />
					</li>
				))}
			</ul>
		</main>
	);
}
