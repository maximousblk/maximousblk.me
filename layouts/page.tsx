import { NextSeo } from "next-seo";

import Container from "@/components/Container";

import config from "@/config";

export default function PageLayout({ children, title, slug, description, hide_description }) {
  const url = `${config.baseUrl}/${slug}`;

  return (
    <Container>
      <NextSeo title={title} description={description} canonical={url} openGraph={{ url, title, description }} />
      <article className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">{title}</h1>
        {!hide_description && <p className="mt-2 mb-8 text-gray-700 dark:text-gray-300">{description}</p>}
        <div className="prose w-full max-w-none dark:prose-dark">{children}</div>
      </article>
    </Container>
  );
}
