/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: { appDir: true },
  images: {
    domains: ["maximousblk.me", "proxy.maximousblk.me", "images.weserv.nl", "cdn.jsdelivr.net", "s3.us-west-2.amazonaws.com"],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        fs: "browserify-fs",
      });
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/feed",
        destination: "/api/feed",
      },
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
      {
        source: "/sponsor",
        destination: "https://github.com/sponsors/maximousblk",
        permanent: true,
      },
    ];
  },
};
