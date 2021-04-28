import Link from "next/link";
import { NextSeo } from "next-seo";

import Container from "@/components/Container";

const errorTypes = {
  404: {
    title: "Not Found",
    message:
      "It seems you've found something that doesn't exist, or you spelled something wrong. Can you double check that URL?"
  },
  500: {
    title: "Internal Server Error",
    message:
      "It seems that the server wasn't able to process your request properly. If the problem persists, please report this issue."
  },
  418: {
    title: "I'm a teapot",
    message: "The server was too lazy to handle this error. Please report this issue so a human can look into this."
  }
};

function ErrorPage({ statusCode }) {
  const err = {
    code: errorTypes[statusCode] ? statusCode : 418,
    title: errorTypes[statusCode] ? errorTypes[statusCode].title : errorTypes[418].title,
    message: errorTypes[statusCode] ? errorTypes[statusCode].message : errorTypes[418].message
  };
  return (
    <Container>
      <NextSeo
        title={err.code + " – " + err.title}
        openGraph={{
          title: err.code + " – " + err.title
        }}
      />
      <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 space-y-8">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          {err.code} – {err.title}
        </h1>
        <p className="text-gray-600 dark:text-coolGray-400 mb-8">{err.message}</p>
        <Link href="/">
          <a className="p-3 w-48 mx-auto text-center rounded-md bg-gray-100 dark:bg-coolGray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-coolGray-700">
            Report issue
          </a>
        </Link>
      </div>
    </Container>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 418;
  return { statusCode };
};

export default ErrorPage;
