import { getSiteMap, getPage } from "@/lib/notion";
import SEO from "./seo";

import config from "@/config";
import { getPlainText } from "@/lib/utils";

export const revalidate = 3600;

async function getData() {
  const index = await getSiteMap();

  const page = await getPage(index.home.id);

  if (!page) return null;

  const title = getPlainText(page.properties.title["title"]);

  return { title };
}

export default async function Head() {
  const { title } = await getData();

  const { description, baseUrl: url } = config;

  return (
    <>
      <title>{config.name}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />

      {/* icons */}
      <link href="/favicon.ico" rel="shortcut icon" />
      <link href="/webmanifest.json" rel="manifest" />
      <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
      <link href="/favicons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
      <link href="/favicons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
      <link color="#111827" href="/favicons/safari-pinned-tab.svg" rel="mask-icon" />

      {/* manifest */}
      <meta name="application-name" content={config.name} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={config.name} />
      <meta name="description" content={config.description} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#111827" />

      {/* misc */}
      <meta content="M4wcsX_DZ9CkpAzZ5rNmUbk1JWl3aLqgxIfB4YG-ozI" name="google-site-verification" />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />

      <SEO title={title} description={description} url={url} />
    </>
  );
}
