import type { NextApiRequest, NextApiResponse } from "next";

import { promises as fs } from "fs";
import path from "path";
import { Feed } from "feed";
import matter from "gray-matter";
import config from "@/config";
import { getDatabase, getIndex } from "@/lib/notion";
import { parseISO } from "date-fns";

const rss = async (req: NextApiRequest, res: NextApiResponse) => {
  const { f } = req.query;

  const format = (f as string) || "atom";

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
      atom: config.baseUrl + "/feed/atom"
    },
    author: {
      name: config.name,
      email: config.email,
      link: config.baseUrl
    }
  });

  const index = await getIndex();
  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter((post) => {
        // @ts-ignore
        return post.properties.published.checkbox;
      })
      .map((post) => {
        return {
          // @ts-ignore
          title: post.properties.title.title.map((part) => part.plain_text).join(" "),
          // @ts-ignore
          description: post.properties.description.rich_text.map((part) => part.plain_text).join(" "),
          // @ts-ignore
          slug: post.properties.slug.rich_text.map((slug) => slug.plain_text).join("__"),
          // @ts-ignore
          publishedAt: parseISO(post.properties.date.date.start).getTime()
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
      date: new Date(post.publishedAt)
    });
  });

  rss.items.sort((a, b) => {
    return a.date > b.date ? -1 : 1;
  });

  const feeds = {
    atom: { body: rss.atom1(), type: "application/xml" },
    json: { body: rss.json1(), type: "application/json" },
    rss: { body: rss.rss2(), type: "application/xml" }
  };

  const feed = feeds[format] || feeds.atom;

  res.status(200);
  res.setHeader("Content-Type", feed.type);
  res.setHeader("Cache-Control", "s-maxage=86400, maxage=86400, stale-while-revalidate");
  res.end(feed.body);
};

export default rss;
