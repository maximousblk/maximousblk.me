import "@/styles/global.scss";
import "@fontsource/inter";
import "@fontsource/lora";
import "@fontsource/jetbrains-mono";

import { ThemeProvider } from "next-themes";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import Script from "next/script";

import SEO from "../next-seo.config";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
      <Script
        async
        defer
        strategy="afterInteractive"
        src="https://analytics.maximousblk.me/umami.js"
        data-website-id="d565f770-836d-42fb-9fe3-0946633cdb49"
      />
    </ThemeProvider>
  );
}

export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }
}
