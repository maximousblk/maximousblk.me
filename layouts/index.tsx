import { NextSeo } from "next-seo";

import Container from "@/components/Container";
import config from "@/config";

export default function IndexLayout({ children, title, description }) {
  const { baseUrl: url } = config;

  return (
    <Container>
      <NextSeo title={title} titleTemplate={"%s"} description={description} canonical={url} openGraph={{ url, title, description }} />
      <article className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">{title}</h1>
        <div className="prose w-full max-w-none dark:prose-dark">{children}</div>
      </article>
    </Container>
  );
}
