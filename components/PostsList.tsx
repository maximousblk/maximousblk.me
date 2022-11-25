"use client";

import { useState } from "react";

import BlogPost from "@/components/BlogPost";
import { FiSearch } from "react-icons/fi";

export default function PostsList({ posts }) {
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
    <>
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

      {(!filteredPosts.length && <p className="my-8 mb-4 self-center text-gray-600 dark:text-gray-400">No posts found ;-;</p>) || (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPosts.map((post) => (
            <BlogPost key={post.slug} {...post} />
          ))}
        </div>
      )}
    </>
  );
}
