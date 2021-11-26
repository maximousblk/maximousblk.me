import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";

import config from "@/config";
import { getDatabase, getIndex } from "@/lib/notion";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const index = await getIndex();
  const pages = await getDatabase(index.pages.id).then((pages) => {
    return pages.results
      .filter((page) => {
        // @ts-ignore
        return page.properties.published.checkbox;
      })
      .map((page) => {
        // @ts-ignore
        const slug = page.properties.slug.rich_text.map((slug) => slug.plain_text).join("__");
        return `/${slug}`;
      });
  });

  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter((post) => {
        // @ts-ignore
        return post.properties.published.checkbox;
      })
      .map((post) => {
        // @ts-ignore
        const slug = post.properties.slug.rich_text.map((slug) => slug.plain_text).join("__");
        return `/posts/${slug}`;
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
