import { useState } from "react";
import { NextSeo } from "next-seo";
import type { GetStaticPropsContext, GetStaticPropsResult } from "next";

import Container from "@/components/Container";
import BlogPost from "@/components/BlogPost";
import { FiSearch } from "react-icons/fi";
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
      <div className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">Posts</h1>
        <div className="relative mb-4 w-full">
          <input
            aria-label={`Search through ${filteredPosts.length} articles`}
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Search through ${filteredPosts.length} articles`}
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
          />
          <FiSearch className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300" />
        </div>
        {!filteredPosts.length && <p className="my-8 mb-4 self-center text-gray-600 dark:text-gray-400">No posts found ;-;</p>}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPosts.map((post) => (
            <BlogPost key={post.title} {...post} />
          ))}
        </div>
      </div>
    </Container>
  );
}

export async function getStaticProps({ preview }: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  const index = await getIndex();
  const posts = await getDatabase(index.posts.id).then((posts) => {
    return posts.results
      .filter(({ properties: { published } }: Page) => {
        return published[published.type] || preview || false;
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
