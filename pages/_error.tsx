import { NextSeo } from "next-seo";

import Container from "@/components/Container";

function UnknownError({ statusCode }) {
  const err = {
    code: 418,
    title: "I'm a teapot",
    message:
      "The server was too lazy to handle this error (" +
      statusCode +
      "). Please report this issue so a human can look into this."
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
        <a
          href="https://github.com/maximousblk/maximousblk.now.sh/issues/new"
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
