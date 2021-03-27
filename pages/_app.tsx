import "@/styles/global.css";

import { MDXProvider } from "@mdx-js/react";
import { ThemeProvider, useTheme } from "next-themes";
import { DefaultSeo } from "next-seo";
import Head from "next/head";

import SEO from "../next-seo.config";
import MDXComponents from "@/components/MDXComponents";

export default function App({ Component, pageProps }) {
  const { theme, setTheme } = useTheme()

  return (
    <ThemeProvider attribute="class">
      <MDXProvider components={MDXComponents}>
        <Head>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <meta name="theme-color" content={theme === "dark" ? "#111827" : "#FFFFFF"} />
        </Head>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </MDXProvider>
    </ThemeProvider>
  );
}
