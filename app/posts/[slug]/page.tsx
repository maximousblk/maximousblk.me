import ProxyImage from "@/components/ProxyImage";
import { getBlockChildren, getSiteMap } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { getReadingTime } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import config from "@/config";
import { previewData } from "next/headers";
import { notFound } from "next/navigation";
import { FiGithub, FiTwitter } from "react-icons/fi";

export const revalidate = 3600;

const discussURL = (title: string) => {
  return `https://github.com/${config.repo.name}/discussions/new?category=post&title=${title}`;
};

const twitterURL = (title: string, slug: string) => {
  const text = encodeURIComponent(`${title} - ${config.name}`);
  const url = encodeURIComponent(`${config.baseUrl}/posts/${slug}`);
  return `http://twitter.com/share?text=${text}&url=${url}`;
};

export default async function Page({ params: { slug } }) {
  const { blocks, title, cover, publishedAt, not_found } = await getData(slug);

  if (not_found) notFound();

  return (
    <article className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">{title}</h1>
      <div className="mt-2 mb-8 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
        <div className="flex items-center">
          <p className="font-mono text-sm text-gray-600 dark:text-gray-400">{format(publishedAt, "PPPP")}</p>
        </div>
        <p className="min-w-32 mt-2 font-mono text-sm text-gray-600 dark:text-gray-400 md:mt-0">{getReadingTime(blocks).text}</p>
      </div>
      {cover && (
        <div className="mb-8 flex h-72 w-full items-center overflow-hidden rounded align-middle">
          {/* @ts-ignore */}
          <ProxyImage src={cover} alt={title} className="object-cover" />
        </div>
      )}
      <div className="prose w-full max-w-none dark:prose-dark">
        <NotionContent blocks={blocks} />
      </div>
      <div className="mt-8 flex space-x-3 text-sm text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 print:hidden">
        <a href={twitterURL(title, slug)} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <FiTwitter size={16} className="mr-1 inline-block text-gray-500 dark:text-gray-500" />
          {"Share on Twitter"}
        </a>
        <p> • </p>
        <a href={discussURL(title)} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <FiGithub size={16} className="mr-1 inline-block text-gray-500 dark:text-gray-500" />
          {"Discuss on GitHub"}
        </a>
      </div>
    </article>
  );
}

async function getData(slug: string) {
  const preview = !!previewData();

  try {
    const {
      posts: { children: posts },
    } = await getSiteMap();

    const {
      id: page_id,
      published,
      title,
      cover,
      properties: { date },
    } = posts.find(({ slug: sl }) => sl === slug) || {};

    if (!page_id) return { not_found: true };
    if (!published && !preview) return { not_found: true };

    const publishedAt = parseISO(date[date.type]?.start).getTime();

    const blocks = await getBlockChildren(page_id);

    return { blocks, title, cover, publishedAt };
  } catch (e) {
    throw e;
  }
}

export async function generateStaticParams() {
  const {
    posts: { children: posts },
  } = await getSiteMap();

  return posts
    .filter(({ published }) => published)
    .map(({ slug }) => {
      return { slug };
    });
}
