import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";
import "@/styles/tokens.css";

import classNames from "classnames";

import { Meta } from "@once-ui-system/core";

import { Footer, Header, Providers } from "@/components";
import { baseURL, style, home } from "@/resources";
import { geistMono, geistSans } from "@/styles/fonts";
// Enable Vercel Speed Insights
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import styles from "./layout.module.css";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export const viewport = { themeColor: "#0E1114", colorScheme: "dark" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Dark only. The data-* attributes keep Once UI working on pages not yet migrated (removed in step D).
      data-theme="dark"
      data-brand={style.brand}
      data-accent={style.accent}
      data-neutral={style.neutral}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      data-scaling={style.scaling}
      className={classNames(geistSans.variable, geistMono.variable)}
    >
      <body className={styles.body}>
        <Providers>
          <SpeedInsights />
          <Analytics />
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
