"use client";

import { DefaultSeo, NextSeo } from "next-seo";
import SEO from "../next-seo.config";

export default function RootSEO({ url, title, description }: { url: string; title: string; description: string }) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <NextSeo title={title} titleTemplate={"%s"} description={description} canonical={url} openGraph={{ url, title, description }} />
    </>
  );
}
