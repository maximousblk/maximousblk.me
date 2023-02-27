import { parseISO } from "date-fns";

import PostsList from "@/components/PostsList";
import { getSiteMap } from "@/lib/notion";
import config from "@/config";

export const revalidate = 3600;

async function getData() {
  const {
    posts: { children: posts },
  } = await getSiteMap();

  return posts
    .filter(({ published }) => {
      return published;
    })
    .map(({ title, description, slug, properties: { date } }) => {
      return {
        title,
        description,
        slug,
        publishedAt: parseISO(date[date.type].start).getTime(),
      };
    })
    .sort((a, b) => {
      return b.publishedAt - a.publishedAt;
    });
}

export const metadata = {
  title: "Posts",
  description: "My blog posts",
  openGraph: {
    type: "article",
    title: "Posts",
    description: "My blog posts",
    url: config.baseUrl + "/posts",
    images: [
      {
        url: config.baseUrl + "/api/og?title=Posts\u0026description=My blog posts",
        alt: "Posts",
        width: 1280,
        height: 720,
      },
    ],
  },
  twitter: {
    title: "Posts",
    description: "My blog posts",
    card: "summary_large_image",
    images: [
      {
        url: config.baseUrl + "/api/og?title=Posts\u0026description=My blog posts",
        alt: "Posts",
        width: 1280,
        height: 720,
      },
    ],
  },
  other: {
    "og:image": config.baseUrl + "/api/og?title=Posts\u0026description=My blog posts",
  },
};

export default async function Posts() {
  const posts = await getData();

  return (
    <main className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">Posts</h1>
      <PostsList posts={posts} />
    </main>
  );
}
