import { format } from "date-fns";
import { FiTwitter, FiGithub } from "react-icons/fi";
import { NextSeo, ArticleJsonLd } from "next-seo";
import Image from "next/image";

import Container from "@/components/Container";
import config from "@/config";

const discussURL = (title: string, slug: string) => {
  return `https://github.com/${config.repo.name}/discussions/new?category=post&title=${title}`;
};
const twitterURL = (title: string, slug: string) => {
  const text = encodeURIComponent(`${title} - ${config.name}`);
  const url = encodeURIComponent(`${config.baseUrl}/posts/${slug}`);
  return `http://twitter.com/share?text=${text}&url=${url}`;
};

const BlogSeo = ({ title, description, publishedAt, url, image }) => {
  const date = new Date(publishedAt).toISOString();
  const featuredImage = {
    url: image?.url ? "https://proxy.maximousblk.me/rewrite?url=" + Buffer.from(image.url).toString("base64") : config.baseUrl + "/og.png",
    alt: title,
    width: image?.width,
    height: image?.height,
    type: image?.type,
  };

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          type: "article",
          article: {
            publishedTime: date,
          },
          url,
          title,
          description: description,
          images: [featuredImage],
        }}
      />
      <ArticleJsonLd
        authorName={config.name}
        dateModified={date}
        datePublished={date}
        description={description}
        images={[featuredImage.url]}
        publisherLogo="/static/favicons/android-chrome-192x192.png"
        publisherName={config.name}
        title={title}
        url={url}
      />
    </>
  );
};

export default function PostLayout({ children, title, slug, cover, publishedAt, description, readingTime }) {
  return (
    <Container>
      <BlogSeo url={`${config.baseUrl}/posts/${slug}`} title={title} description={description} image={cover} publishedAt={publishedAt} />
      <article className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">{title}</h1>
        <div className="mt-2 mb-8 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
          <div className="flex items-center">
            <p className="font-mono text-sm text-gray-600 dark:text-gray-400">{format(publishedAt, "PPPP")}</p>
          </div>
          <p className="min-w-32 mt-2 font-mono text-sm text-gray-600 dark:text-gray-400 md:mt-0">{readingTime}</p>
        </div>
        {cover && (
          <div className="mb-8 flex h-72 w-full items-center overflow-hidden rounded align-middle">
            <Image
              src={"https://proxy.maximousblk.me/rewrite?url=" + Buffer.from(cover.url).toString("base64")}
              alt=""
              width={cover.width}
              height={cover.height}
              placeholder="blur"
              blurDataURL={cover.placeholder}
              className="object-cover"
            />
          </div>
        )}
        <div className="prose w-full max-w-none dark:prose-dark">{children}</div>
        <div className="mt-8 flex space-x-3 text-sm text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 print:hidden">
          <a href={twitterURL(title, slug)} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <FiTwitter size={16} className="mr-1 inline-block text-gray-500 dark:text-gray-500" />
            {"Share on Twitter"}
          </a>
          <p> • </p>
          <a href={discussURL(title, slug)} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <FiGithub size={16} className="mr-1 inline-block text-gray-500 dark:text-gray-500" />
            {"Discuss on GitHub"}
          </a>
        </div>
      </article>
    </Container>
  );
}
