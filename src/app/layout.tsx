import "@/styles/base.css";
import "@/styles/tokens.css";

import { Footer, Header } from "@/components";
import { home } from "@/resources";
import { geistMono, geistSans } from "@/styles/fonts";
// Enable Vercel Speed Insights
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { pageMetadata } from "@/utils/seo";
import styles from "./layout.module.css";

export const metadata = pageMetadata({
  title: home.title,
  description: home.description,
  path: home.path,
  image: home.image,
});

// Literal required by the Viewport API: same value as --palette-titanio.
export const viewport = { themeColor: "#0E1114", colorScheme: "dark" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={styles.body}>
        <SpeedInsights />
        <Analytics />
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
