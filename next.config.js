const withPWA = require("next-pwa");

/** @type {import('next').NextConfig} */
const config = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ["cdn.maximousblk.me", "twemoji.maxcdn.com", "s3.us-west-2.amazonaws.com"],
  },
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
  },
  async rewrites() {
    return [
      {
        source: "/feed/:format*",
        destination: "/api/feed?f=:format*",
      },
      {
        source: "/sitemap.xml",
        destination: "/sitemap",
      },
      {
        source: "/robots.txt",
        destination: "/.well-known/robots.txt",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/post/:path*",
        destination: "/posts/:path*",
        permanent: true,
      },
      {
        source: "/pgp",
        destination: "https://keybase.io/maximousblk/pgp_keys.asc",
        permanent: false,
      },
    ];
  },
};

module.exports = withPWA(config);
