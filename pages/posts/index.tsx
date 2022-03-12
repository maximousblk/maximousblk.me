import { useState } from "react";
import { NextSeo } from "next-seo";

import Container from "@/components/Container";
import BlogPost from "@/components/BlogPost";
import { Search as SearchIcon } from "react-feather";
import { parseISO } from "date-fns";

import config from "@/config";
import { getDatabase, getIndex } from "@/lib/notion";
import { slugify } from "@/lib/utils";
import { Page } from "@jitl/notion-api";

const url = config.baseUrl + "/posts";
const title = "Posts";
const description = config.description;

export default function Posts({ posts }) {
  const [searchValue, setSearchValue] = useState("");
  const filteredPosts = posts
    .sort((a, b) => {
      return Number(b.publishedAt) - Number(a.publishedAt);
    })
    .filter((post) => {
      return (
        post.title.toLowerCase().includes(searchValue.toLowerCase()) || post.description?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

  return (
    <Container>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description,
        }}
      />
      <div className="flex flex-col justify-center items-start w-full max-w-4xl mx-auto mb-16">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 text-black dark:text-white">Posts</h1>
        <div className="relative w-full mb-4">
          <input
            aria-label={`Search through ${filteredPosts.length} articles`}
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Search through ${filteredPosts.length} articles`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-800 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <SearchIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300" />
        </div>
        {!filteredPosts.length && <p className="my-8 self-center text-gray-600 dark:text-gray-400 mb-4">No posts found ;-;</p>}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPosts.map((post) => (
            <BlogPost key={post.title} {...post} />
          ))}
        </div>
      </div>
    </Container>
  );
}

export async function getStaticProps() {
  const index = await getIndex();
  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter(({ properties: { published } }: Page) => {
        return published[published.type];
      })
      .map(({ properties: { title: postTitle, description: postDescription, slug: postSlug, date } }: Page) => {
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

  return { props: { posts }, revalidate: 1800 };
}
