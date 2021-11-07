import { useState } from "react";
import { NextSeo } from "next-seo";

import Container from "@/components/Container";
import BlogPost from "@/components/BlogPost";
import { Search as SearchIcon } from "react-feather";
import { parseISO } from "date-fns";

import config from "@/config";
import { getDatabase, getIndex } from "@/lib/notion";

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
            className="px-4 py-2 border border-gray-300 dark:border-coolGray-700 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md bg-white dark:bg-coolGray-800 text-gray-900 dark:text-coolGray-100"
          />
          <SearchIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-coolGray-300" />
        </div>
        {!filteredPosts.length && <p className="my-8 self-center text-gray-600 dark:text-coolGray-400 mb-4">No posts found ;-;</p>}
        <div className="divide-y divide-gray-200 dark:divide-coolGray-700">
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
          publishedAt: parseISO(post.properties.date.date.start).getTime(),
        };
      })
      .sort((a, b) => {
        return Number(b.publishedAt) - Number(a.publishedAt);
      });
  });

  return { props: { posts }, revalidate: 3600 };
}
