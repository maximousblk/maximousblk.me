import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";

import config from "@/config";
import { getDatabase, getIndex } from "@/lib/notion";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const index = await getIndex();
  const pages = await getDatabase(index.pages.id).then((pages) => {
    return pages.results
      .filter(({ properties: { published } }) => {
        return published[published.type];
      })
      .map(({ properties: { slug } }) => {
        return `/${slug[slug.type].map(({ plain_text }) => plain_text).join("__")}`;
      });
  });

  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter(({ properties: { published } }) => {
        return published[published.type];
      })
      .map(({ properties: { slug } }) => {
        return `/posts/${slug[slug.type].map(({ plain_text }) => plain_text).join("__")}`;
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
