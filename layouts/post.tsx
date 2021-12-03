import { format } from "date-fns";
import { ExternalLink } from "react-feather";
import { NextSeo, ArticleJsonLd } from "next-seo";
import Image from "next/image";

import Container from "@/components/Container";
import config from "@/config";

const discussURL = (title: string, slug: string) => {
  return `https://github.com/${config.repo.name}/discussions/new?category=post&title=${title}`;
};
const twitterURL = (title: string, slug: string) => {
  const text = encodeURIComponent(title);
  const url = encodeURIComponent(`${config.baseUrl}/posts/${slug}`);
  return `http://twitter.com/share?text=${text}&url=${url}`;
};

const BlogSeo = ({ title, description, publishedAt, url, image }) => {
  const date = new Date(publishedAt).toISOString();
  const featuredImage = {
    url: image?.url || config.baseUrl + "/og.png",
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
      <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">{title}</h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mt-2 mb-8">
          <div className="flex items-center">
            <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{format(publishedAt, "PPPP")}</p>
          </div>
          <p className="text-sm font-mono text-gray-600 dark:text-gray-400 min-w-32 mt-2 md:mt-0">{readingTime}</p>
        </div>
        {cover && (
          <div className="flex mb-8 w-full h-72 rounded overflow-hidden">
            <Image src={cover.url} alt="" width={cover.width} height={cover.height} className="object-cover" />
          </div>
        )}
        <div className="prose dark:prose-dark max-w-none w-full">{children}</div>
        <div className="flex space-x-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 mt-8">
          <a href={twitterURL(title, slug)} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {"Share on Twitter"}
            <ExternalLink size={16} className="inline-block ml-1 text-gray-500 dark:text-gray-500" />
          </a>
          <p> • </p>
          <a href={discussURL(title, slug)} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {"Discuss on GitHub"}
            <ExternalLink size={16} className="inline-block ml-1 text-gray-500 dark:text-gray-500" />
          </a>
        </div>
      </article>
    </Container>
  );
}
