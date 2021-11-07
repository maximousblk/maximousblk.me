import { NextSeo } from "next-seo";

import Container from "@/components/Container";
import config from "@/config";

export default function IndexLayout({ children, title, description }) {
  const { baseUrl: url } = config;

  return (
    <Container>
      <NextSeo title={title} titleTemplate={"%s"} description={description} canonical={url} openGraph={{ url, title, description }} />
      <article className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 w-full">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">{title}</h1>
        <div className="prose dark:prose-dark max-w-none w-full">{children}</div>
      </article>
    </Container>
  );
}
