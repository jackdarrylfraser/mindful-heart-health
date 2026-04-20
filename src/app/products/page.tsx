import React from "react";
import { getDrizzleClient } from "@/src/lib/database";
import { product as productTable } from "@/src/lib/schema";
import { ProductCard } from "@/src/app/components/ProductCard";

async function getProducts() {
	const drizzleClient = await getDrizzleClient();
	return drizzleClient.select().from(productTable);
}

export default async function ProductsPage() {
	const products = await getProducts();
	return (
		<main className="max-w-xl py-8 mx-auto">
			<h1 className="mb-4 text-2xl font-bold">Products</h1>
			<ul className="space-y-4">
				{products.map((p) => (
					<ProductCard
						key={p.id}
						id={p.id}
						name={p.name}
						description={p.description}
						priceCents={p.priceCents.toString()}
					/>
				))}
			</ul>
		</main>
	);
}
