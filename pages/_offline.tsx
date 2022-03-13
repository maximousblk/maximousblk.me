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
      <div className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 space-y-8">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">No Internet Connection</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! Looks like you&apos;re offline. This page is not ready for offline viewing yet.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          <blockquote className="px-4 p-2 border-l-4 border-gray-300 dark:border-gray-700">
            <code>ERR_INTERNET_DISCONNECTED</code>
          </blockquote>
        </p>
      </div>
    </Container>
  );
}

export default NoInternet;
