import type { NextApiRequest, NextApiResponse } from "next";

import { promises as fs } from "fs";
import path from "path";
import RSS from "rss";
import matter from "gray-matter";
import config from "@/data/config";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const feed = new RSS({
    title: config.name,
    description: config.description,
    site_url: config.baseUrl,
    feed_url: config.baseUrl + "/rss",
    image_url: config.baseUrl + "/og.png",
    copyright: config.name,
    language: "en",
    ttl: 1440
  });

  const posts = await fs.readdir(path.join(process.cwd(), "data", "posts"));

  await Promise.all(
    posts.map(async (name) => {
      const content = await fs.readFile(path.join(process.cwd(), "data", "posts", name));
      const frontmatter = matter(content);

      if (frontmatter.data.published) {
        feed.item({
          title: frontmatter.data.title,
          url: config.baseUrl + "/posts/" + name.replace(/\.mdx?/, ""),
          date: frontmatter.data.publishedAt,
          description: frontmatter.data.description
        });
      }
    })
  );

  res.status(200);
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=86400, maxage=86400, stale-while-revalidate");
  res.end(feed.xml({ indent: true }));
};
