import { type NextRequest } from "next/server";
import { Feed } from "feed";
import { parseISO } from "date-fns";

import config from "@/config";
import { getDatabase, getSiteMap } from "@/lib/notion";
import { getPlainText, slugify } from "@/lib/utils";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const revalidate = 3600;

export async function GET(req: NextRequest, { params }) {
  const format: string = params?.f || "atom";

  const rss = new Feed({
    title: config.name,
    description: config.description,
    id: config.baseUrl,
    link: config.baseUrl,
    language: "en",
    image: config.baseUrl + "/og.png",
    favicon: config.baseUrl + "/favicon.ico",
    copyright: "All rights reserved 2020, " + config.name,
    ttl: 3600,
    feed: config.baseUrl + "/feed/" + format,
    hub: "https://pubsubhubbub.appspot.com/",
    updated: new Date(),
    generator: "https://github.com/maximousblk/maximousblk.me/blob/main/pages/api/feed.ts",
    docs: "",
    feedLinks: {
      json: config.baseUrl + "/feed/json",
      rss: config.baseUrl + "/feed/rss",
      atom: config.baseUrl + "/feed/atom",
    },
    author: {
      name: config.name,
      email: config.email,
      link: config.baseUrl,
    },
  });

  const index = await getSiteMap();
  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter(({ properties: { published } }: PageObjectResponse) => {
        return published[published.type] || false;
      })
      .map(({ properties: { title: postTitle, description: postDescription, date } }: PageObjectResponse) => {
        return {
          title: getPlainText(postTitle[postTitle.type]),
          description: getPlainText(postDescription[postDescription.type]),
          slug: slugify(getPlainText(postTitle[postTitle.type])),
          publishedAt: parseISO(date[date.type].start).getTime(),
        };
      })
      .sort((a, b) => {
        return Number(b.publishedAt) - Number(a.publishedAt);
      });
  });

  posts.map((post) => {
    rss.addItem({
      title: post.title,
      id: post.slug,
      link: config.baseUrl + "/posts/" + post.slug,
      description: post.description,
      date: new Date(post.publishedAt),
    });
  });

  rss.items.sort((a, b) => {
    return a.date > b.date ? -1 : 1;
  });

  const feeds = {
    atom: { body: rss.atom1(), type: "application/xml" },
    json: { body: rss.json1(), type: "application/json" },
    rss: { body: rss.rss2(), type: "application/xml" },
  };

  const feed = feeds[format] || feeds.atom;

  return new Response(feed.body, {
    status: 200,
    headers: {
      "Content-Type": feed.type,
      "Cache-Control": "s-maxage=86400, maxage=86400, stale-while-revalidate",
    },
  });
}
