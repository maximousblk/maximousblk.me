import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";

import { slugify } from "@/lib/utils";
import config from "@/config";
import { getDatabase, getIndex } from "@/lib/notion";
import { Page } from "@jitl/notion-api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const index = await getIndex();
  const pages = await getDatabase(index.pages.id).then((pages) => {
    return pages.results
      .filter(({ properties: { published } }: Page) => {
        return published[published.type] || ctx.preview || false;
      })
      .map(({ properties: { title } }: Page) => {
        return `/${slugify(title[title.type].map(({ plain_text }) => plain_text))}`;
      });
  });

  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter(({ properties: { published } }: Page) => {
        return published[published.type] || ctx.preview || false;
      })
      .map(({ properties: { title } }: Page) => {
        return `/posts/${slugify(title[title.type].map(({ plain_text }) => plain_text))}`;
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
