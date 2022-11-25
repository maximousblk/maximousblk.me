import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";

import { getPlainText, slugify } from "@/lib/utils";
import config from "@/config";
import { getDatabase, getSiteMap } from "@/lib/notion";
import { Page } from "@jitl/notion-api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const index = await getSiteMap();
  const pages = await getDatabase(index.pages.id).then((pages) => {
    return pages.results
      .filter(({ properties: { published } }: Page) => {
        return published[published.type] || ctx.preview || false;
      })
      .map(({ properties: { title } }: Page) => {
        return `/${slugify(getPlainText(title[title.type]))}`;
      });
  });

  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter(({ properties: { published } }: Page) => {
        return published[published.type] || ctx.preview || false;
      })
      .map(({ properties: { title } }: Page) => {
        return `/posts/${slugify(getPlainText(title[title.type]))}`;
      });
  });

  const entries: ISitemapField[] = ["", ...pages, "/posts", ...posts].map((route) => {
    return {
      loc: config.baseUrl + route,
      lastmod: new Date().toISOString(),
      priority: 0.7,
    };
  });

  return getServerSideSitemap(ctx, entries);
};

function SiteMap() {}
export default SiteMap;
