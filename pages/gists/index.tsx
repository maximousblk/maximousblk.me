import { useState } from "react";
import { NextSeo } from "next-seo";
import { Search as SearchIcon } from "react-feather";

import Container from "@/components/Container";
import GistCard from "@/components/GistCard";
import { getAllFilesFrontMatter } from "@/lib/mdx";

import config from "@/data/config";

const url = config.baseUrl + "/gists";
const title = "Gists";

export default function Gists({ gists }) {
  const [searchValue, setSearchValue] = useState("");
  const filteredGists = gists.sort().filter((frontMatter) => {
    return (
      (frontMatter.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        frontMatter.description?.toLowerCase().includes(searchValue.toLowerCase())) &&
      frontMatter.published
    );
  });

  return (
    <Container>
      <NextSeo
        title={title}
        canonical={url}
        openGraph={{
          url,
          title
        }}
      />
      <div className="flex flex-col justify-center items-start w-full max-w-4xl mx-auto mb-16">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">Gists</h1>
        <p className="text-gray-600 dark:text-coolGray-400 mb-4">
          These are a collection of code gists I&apos;ve used in the past and saved.
        </p>
        <div className="relative w-full mb-4">
          <input
            aria-label={`Search through ${filteredGists.length} gists`}
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Search through ${filteredGists.length} gists`}
            className="px-4 py-2 border border-gray-300 dark:border-coolGray-700 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md bg-white dark:bg-coolGray-800 text-gray-900 dark:text-coolGray-100"
          />
          <SearchIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-coolGray-300" />
        </div>
        {!filteredGists.length && <p className="my-8 self-center text-gray-600 dark:text-coolGray-400 mb-4">No gists found ;-;</p>}
        <div className="grid gap-4 grid-cols-1 my-2 w-full mt-4">
          {filteredGists.map((gist) => (
            <GistCard key={gist.slug} title={gist.title} slug={gist.slug} description={gist.description} />
          ))}
        </div>
      </div>
    </Container>
  );
}

export async function getStaticProps() {
  const gists = await getAllFilesFrontMatter("gists");

  return { props: { gists }, revalidate: 3600 };
}
