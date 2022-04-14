import Link from "next/link";
import { NextSeo } from "next-seo";

import Container from "@/components/Container";

function InternalServerError() {
  return (
    <Container>
      <NextSeo
        title="500 – Internal Server Error"
        titleTemplate={`%s`}
        openGraph={{
          title: "500 – Internal Server Error",
        }}
      />
      <div className="mx-auto mb-16 flex max-w-4xl flex-col items-start justify-center space-y-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">500 – Internal Server Error</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">It seems that the server wasn&apos;t able to process your request properly.</p>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          <blockquote className="border-l-4 border-gray-300 p-2 px-4 dark:border-gray-700">
            <code>HTTP ERROR 500</code>
          </blockquote>
        </p>
        <Link href="/">
          <a className="mx-auto w-48 rounded-md bg-gray-100 p-3 text-center text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 print:hidden">
            Go to Home
          </a>
        </Link>
      </div>
    </Container>
  );
}

export default InternalServerError;
