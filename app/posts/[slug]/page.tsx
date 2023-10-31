import ServerImage from "@/components/ServerImage";
import { getBlockChildren, getSiteMap } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { getReadingTime, getPlainText } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import config from "@/config";
import { notFound } from "next/navigation";
import { FiGithub, FiTwitter } from "react-icons/fi";
import { Metadata } from "next/types";

export const revalidate = 3600;

const discussURL = (title: string) => {
  return `https://github.com/${config.repo.name}/discussions/new?category=post&title=${title}`;
};

const twitterURL = (title: string, slug: string) => {
  const text = encodeURIComponent(`${title} - ${config.name}`);
  const url = encodeURIComponent(`${config.baseUrl}/posts/${slug}`);
  return `http://twitter.com/share?text=${text}&url=${url}`;
};

export async function generateMetadata({ params, searchParams }): Promise<Metadata> {
  const { title, blocks, not_found } = await getData(params.slug);

  if (not_found) return notFound();
  const _block = blocks.find((b) => !!b[b.type].rich_text);
  const description = getPlainText(_block[_block.type].rich_text);
  const og_image = config.baseUrl + "/api/og?title=" + encodeURIComponent(title) + "&description=" + encodeURIComponent(description);

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url: config.baseUrl + "/posts/" + params.slug,
      images: [
        {
          url: og_image,
          alt: title,
          width: 1280,
          height: 720,
        },
      ],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: [
        {
          url: og_image,
          alt: title,
          width: 1280,
          height: 720,
        },
      ],
    },
    other: {
      "og:image": og_image,
    },
  };
}

export default async function Page({ params: { slug } }) {
  const { blocks, title, cover, publishedAt, not_found } = await getData(slug);

  if (not_found) notFound();

  return (
    <article className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">{title}</h1>
      <div className="mb-8 mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
        <div className="flex items-center">
          <p className="font-mono text-sm text-gray-600 dark:text-gray-400">{format(publishedAt, "PPPP")}</p>
        </div>
        <p className="min-w-32 mt-2 font-mono text-sm text-gray-600 dark:text-gray-400 md:mt-0">{getReadingTime(blocks).text}</p>
      </div>
      {cover && (
        <div className="mb-8 flex h-72 w-full items-center overflow-hidden rounded align-middle">
          <ServerImage src={cover} alt={title} className="object-cover" />
        </div>
      )}
      <div className="prose w-full max-w-none dark:prose-dark">
        <NotionContent blocks={blocks} />
      </div>
      <div className="mt-8 flex space-x-3 text-sm text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 print:hidden">
        <a
          href={twitterURL(title, slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="group underline-offset-2 hover:text-accent-warm-500 hover:underline hover:dark:text-accent-cool-400"
        >
          <FiTwitter
            size={16}
            className="mr-1 inline-block text-gray-500 group-hover:text-accent-warm-500 dark:text-gray-300 group-hover:dark:text-accent-cool-400"
          />
          {"Share on Twitter"}
        </a>
        <p> • </p>
        <a
          href={discussURL(title)}
          target="_blank"
          rel="noopener noreferrer"
          className="group underline-offset-2 hover:text-accent-warm-500 hover:underline hover:dark:text-accent-cool-400"
        >
          <FiGithub
            size={16}
            className="mr-1 inline-block text-gray-500 group-hover:text-accent-warm-500 dark:text-gray-300 group-hover:dark:text-accent-cool-400"
          />
          {"Discuss on GitHub"}
        </a>
      </div>
    </article>
  );
}

async function getData(slug: string) {
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
    if (!published) return { not_found: true };

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
