import { NextSeo } from "next-seo";

import Container from "@/components/Container";

function NoInternet() {
  return (
    <Container>
      <NextSeo
        title="ERR_INTERNET_DISCONNECTED"
        titleTemplate={`%s`}
        openGraph={{
          title: "ERR_INTERNET_DISCONNECTED",
        }}
      />
      <div className="mx-auto mb-16 flex max-w-4xl flex-col items-start justify-center space-y-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">No Internet Connection</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Oops! Looks like you&apos;re offline. This page is not ready for offline viewing yet.
        </p>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          <blockquote className="border-l-4 border-gray-300 p-2 px-4 dark:border-gray-700">
            <code>ERR_INTERNET_DISCONNECTED</code>
          </blockquote>
        </p>
      </div>
    </Container>
  );
}

export default NoInternet;
