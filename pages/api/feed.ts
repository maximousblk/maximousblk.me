import type { NextApiRequest, NextApiResponse } from "next";
import { Feed } from "feed";
import config from "@/config";
import { getDatabase, getIndex } from "@/lib/notion";
import { parseISO } from "date-fns";
import { slugify } from "@/lib/utils";

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
      atom: config.baseUrl + "/feed/atom",
    },
    author: {
      name: config.name,
      email: config.email,
      link: config.baseUrl,
    },
  });

  const index = await getIndex();
  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter(({ properties: { published } }) => {
        return published[published.type];
      })
      .map(({ properties: { title: postTitle, description: postDescription, date } }) => {
        return {
          title: postTitle[postTitle.type].map(({ plain_text }) => plain_text).join(" "),
          description: postDescription[postDescription.type].map(({ plain_text }) => plain_text).join(" "),
          slug: slugify(postTitle[postTitle.type].map(({ plain_text }) => plain_text)),
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

  res.status(200);
  res.setHeader("Content-Type", feed.type);
  res.setHeader("Cache-Control", "s-maxage=86400, maxage=86400, stale-while-revalidate");
  res.end(feed.body);
};

export default rss;
