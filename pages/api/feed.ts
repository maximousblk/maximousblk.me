import type { NextApiRequest, NextApiResponse } from "next";

import { promises as fs } from "fs";
import path from "path";
import { Feed } from "feed";
import matter from "gray-matter";
import config from "@/data/config";

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
    ttl: 1440,
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

  const posts = await fs.readdir(path.join(process.cwd(), "data", "posts"));

  await Promise.all(
    posts.map(async (name) => {
      const content = await fs.readFile(path.join(process.cwd(), "data", "posts", name));
      const frontmatter = matter(content);

      if (frontmatter.data.published) {
        rss.addItem({
          title: frontmatter.data.title,
          id: name.replace(/\.mdx?/, ""),
          link: config.baseUrl + "/posts/" + name.replace(/\.mdx?/, ""),
          description: frontmatter.data.description,
          date: new Date(frontmatter.data.publishedAt),
          image: config.baseUrl + frontmatter.data.image,
          content: frontmatter.content
        });
      }
    })
  );

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
