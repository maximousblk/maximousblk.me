import { getServerSideSitemap, ISitemapField } from "next-sitemap";

import config from "@/config";
import { getSiteMap } from "@/lib/notion";

export const revalidate = 3600;

export async function GET() {
  const {
    posts: { children: posts },
    pages: { children: pages },
  } = await getSiteMap();

  const x_pages = pages
    .filter(({ published }) => {
      return published || false;
    })
    .map(({ slug, last_edited_time }) => {
      return {
        loc: config.baseUrl + "/" + slug,
        lastmod: new Date(last_edited_time).toISOString(),
        priority: 0.7,
      };
    });

  const x_posts = posts
    .filter(({ published }) => {
      return published || false;
    })
    .map(({ slug, last_edited_time }) => {
      return {
        loc: config.baseUrl + "/posts/" + slug,
        lastmod: new Date(last_edited_time).toISOString(),
        priority: 0.7,
      };
    });

  const entries: ISitemapField[] = [
    {
      loc: config.baseUrl,
      lastmod: new Date().toISOString(),
      priority: 0.7,
    },
    ...x_pages,
    {
      loc: config.baseUrl + "/posts",
      lastmod: new Date().toISOString(),
      priority: 0.7,
    },
    ...x_posts,
  ];

  return getServerSideSitemap(entries);
}
