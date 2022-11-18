import Link from "next/link";
import { NextSeo } from "next-seo";

import Container from "@/components/Container";

function NotFound() {
  return (
    <Container>
      <NextSeo
        title="404 – Not Found"
        titleTemplate={`%s`}
        openGraph={{
          title: "404 – Not Found",
        }}
      />
      <div className="mx-auto mb-16 flex max-w-4xl flex-col items-start justify-center space-y-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">404 – Not Found</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          It seems what you&apos;re trying to find doesn&apos;t exist, or you spelled something wrong.
        </p>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          <blockquote className="border-l-4 border-gray-300 p-2 px-4 dark:border-gray-700">
            <code>HTTP ERROR 404</code>
          </blockquote>
        </p>
        <Link
          href="/"
          className="mx-auto w-48 rounded-md bg-gray-100 p-3 text-center text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 print:hidden"
        >
          Go to Home
        </Link>
      </div>
    </Container>
  );
}

export default NotFound;
