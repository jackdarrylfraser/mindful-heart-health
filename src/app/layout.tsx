// app/layout.tsx
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "@/src/app/style/globals.css"; // Your Tailwind or global styles
import { ReactNode } from "react";
import Script from "next/script";
import { env } from "@/src/lib/env";

export const dynamic = "force-static";

export default async function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	const pageMap = await getPageMap();
	return (
		<html lang="en" dir="ltr" suppressHydrationWarning>
			<body>
				{env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
					<Script
						defer
						src="https://cloud.umami.is/script.js"
						data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
					/>
				)}
				<Layout
					pageMap={pageMap}
					editLink={false}
					feedback={{ content: null }}
					navbar={<Navbar logo={<b> Mindful Heart Health </b>} />}
					footer={<Footer />}
				>
					{children}
				</Layout>
			</body>
		</html>
	);
}
