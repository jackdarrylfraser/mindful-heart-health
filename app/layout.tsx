// app/layout.tsx
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css"; // Your Tailwind or global styles
import { ReactNode } from "react";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          pageMap={pageMap}
          navbar={<Navbar logo={<b> Lower Your Bloor Pressure </b>} />}
          footer={<Footer />}
          docsRepositoryBase="https://github.com/shuding/nextra"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}