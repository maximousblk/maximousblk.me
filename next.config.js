const withPWA = require("next-pwa");
const withPreact = require("next-plugin-preact");

/** @type {import('next').NextConfig} */
module.exports = withPWA(
  withPreact({
    experimental: {
      nftTracing: true // Fix for `ENOENT: no such file or directory, scandir '/var/task/<path>'`
    },
    reactStrictMode: true,
    images: {
      domains: ["cdn.maximousblk.me", "octodex.github.com", "twemoji.maxcdn.com"]
    },
    pwa: {
      disable: process.env.NODE_ENV === "development",
      dest: "public"
    },
    async rewrites() {
      return [
        {
          source: "/feed/:format*",
          destination: "/api/feed?f=:format*"
        },
        {
          source: "/sitemap.xml",
          destination: "/sitemap"
        },
        {
          source: "/robots.txt",
          destination: "/.well-known/robots.txt"
        },
        {
          source: "/keybase.txt",
          destination: "/.well-known/keybase.txt"
        }
      ];
    },
    async redirects() {
      return [
        {
          source: "/post/:path*",
          destination: "/posts/:path*",
          permanent: true
        },
        {
          source: "/pgp",
          destination: "https://keybase.io/maximousblk/pgp_keys.asc",
          permanent: false
        }
      ];
    }
  })
);
