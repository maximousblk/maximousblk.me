import PostsList from "@/components/PostsList";
import { parseISO } from "date-fns";

import { getSiteMap } from "@/lib/notion";

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
