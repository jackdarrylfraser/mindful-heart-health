import StripeCheckoutButton from "@/src/app/components/CheckoutButton";

export function ProductCard({
	id,
	name,
	description,
	priceCents,
}: {
	id: string;
	name: string;
	description: string | null;
	priceCents: string;
}) {
	return (
		<li className="flex items-center justify-between p-4 border rounded">
			<div>
				<div className="font-semibold">{name}</div>
				<div className="text-sm text-gray-500">{description}</div>
				<div className="mt-1 text-sm text-gray-700">
					{Number(priceCents) / 100} USD
				</div>
			</div>
			<StripeCheckoutButton productId={id} userId="" />
		</li>
	);
}
