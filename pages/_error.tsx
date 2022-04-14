import { NextSeo } from "next-seo";

import Container from "@/components/Container";

function UnknownError({ statusCode }) {
  return (
    <Container>
      <NextSeo
        title="418 – I'm a teapot"
        titleTemplate={`%s`}
        openGraph={{
          title: "418 – I'm a teapot",
        }}
      />
      <div className="mx-auto mb-16 flex max-w-4xl flex-col items-start justify-center space-y-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">418 – I&apos;m a teapot</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The server was too lazy to handle this error. Please report this issue so a human can look into this.
        </p>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          <blockquote className="border-l-4 border-gray-300 p-2 px-4 dark:border-gray-700">
            <code>ERROR {statusCode}</code>
          </blockquote>
        </p>
        <a
          href="https://github.com/maximousblk/maximousblk.me/issues/new"
          className="mx-auto w-48 rounded-md bg-gray-100 p-3 text-center text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 print:hidden"
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
