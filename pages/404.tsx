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
      <div className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 space-y-8">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">404 – Not Found</h1>
        <p className="text-gray-600 dark:text-coolGray-400 mb-8">
          It seems what you&apos;re trying to find doesn&apos;t exist, or you spelled something wrong.
        </p>
        <p className="text-gray-600 dark:text-coolGray-400 mb-8">
          <blockquote className="px-4 p-2 border-l-4 border-gray-300 dark:border-coolGray-700">
            <code>HTTP ERROR 404</code>
          </blockquote>
        </p>
        <Link href="/">
          <a className="p-3 w-48 mx-auto text-center rounded-md bg-gray-100 dark:bg-coolGray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-coolGray-700">
            Go to Home
          </a>
        </Link>
      </div>
    </Container>
  );
}

export default NotFound;
