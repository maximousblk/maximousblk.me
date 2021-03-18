import { NextSeo } from "next-seo";

import Container from "@/components/Container";
import config from "@/data/config";

export default function IndexLayout({ children, frontMatter }) {
  const { title, description, hide_description } = frontMatter;
  const { baseUrl: url } = config;

  return (
    <Container>
      <NextSeo title={title} description={description} canonical={url} openGraph={{ url, title, description }} />
      <article className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 w-full">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">{title}</h1>
        {!hide_description && <p className="text-gray-700 dark:text-coolGray-300 mt-2 mb-8">{description}</p>}
        <div className="prose dark:prose-dark min-w-full">{children}</div>
      </article>
    </Container>
  );
}
