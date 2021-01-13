import Document, { Html, Head, Main, NextScript } from "next/document";

import config from "@/data/config";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head>
          {/* icons */}
          <link href="/favicon.ico" rel="shortcut icon" />
          <link href="/webmanifest.json" rel="manifest" />
          <link
            href="/favicons/apple-touch-icon.png"
            rel="apple-touch-icon"
            sizes="180x180"
          />
          <link
            href="/favicons/favicon-32x32.png"
            rel="icon"
            sizes="32x32"
            type="image/png"
          />
          <link
            href="/favicons/favicon-16x16.png"
            rel="icon"
            sizes="16x16"
            type="image/png"
          />
          <link
            color="#111827"
            href="/favicons/safari-pinned-tab.svg"
            rel="mask-icon"
          />
          {/* manifest */}
          <meta name="application-name" content={config.name} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={config.name} />
          <meta name="description" content={config.description} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#111827" />

          {/* misc */}
          <link rel="preconnect" href="https://rsms.me" />
          <link rel="preconnect" href="https://cdn.jsdelivr.net" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta
            content="M4wcsX_DZ9CkpAzZ5rNmUbk1JWl3aLqgxIfB4YG-ozI"
            name="google-site-verification"
          />
        </Head>
        <body className="bg-white dark:bg-black text-white dark:text-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
