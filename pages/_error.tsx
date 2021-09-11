import { NextSeo } from "next-seo";

import Container from "@/components/Container";

function UnknownError({ statusCode }) {
  return (
    <Container>
      <NextSeo
        title="418 – I'm a teapot"
        openGraph={{
          title: "418 – I'm a teapot"
        }}
      />
      <div className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 space-y-8">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">418 – I&apos;m a teapot</h1>
        <p className="text-gray-600 dark:text-coolGray-400 mb-8">
          The server was too lazy to handle this error. Please report this issue so a human can look into this.
        </p>
        <p className="text-gray-600 dark:text-coolGray-400 mb-8">
          <blockquote className="px-4 p-2 border-l-4 border-gray-300 dark:border-coolGray-700">
            <code>ERROR {statusCode}</code>
          </blockquote>
        </p>
        <a
          href="https://github.com/maximousblk/maximousblk.me/issues/new"
          className="p-3 w-48 mx-auto text-center rounded-md bg-gray-100 dark:bg-coolGray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-coolGray-700"
        >
          Report issue
        </a>
      </div>
    </Container>
  );
}

UnknownError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 418;
  return { statusCode };
};

export default UnknownError;
