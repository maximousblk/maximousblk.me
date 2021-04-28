import Link from "next/link";
import { NextSeo } from "next-seo";

import Container from "@/components/Container";

function InternalServerError() {
  const err = {
    code: 500,
    title: "Internal Server Error",
    message: "It seems that the server wasn't able to process your request properly."
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
            Go to Home
          </a>
        </Link>
      </div>
    </Container>
  );
}

export default InternalServerError;
