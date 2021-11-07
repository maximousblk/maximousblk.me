import { NextSeo } from "next-seo";

import Container from "@/components/Container";

import config from "@/config";

export default function GistLayout({ children, slug, title, description, hide_description }) {
  const url = `${config.baseUrl}/gists/${slug}`;

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
      <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full">
        <div className="flex justify-between w-full mb-8">
          <div>
            <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">{title}</h1>
            {!hide_description && <p className="text-gray-700 dark:text-coolGray-300">{description}</p>}
          </div>
        </div>
        <div className="prose dark:prose-dark max-w-none w-full">{children}</div>
      </article>
    </Container>
  );
}
