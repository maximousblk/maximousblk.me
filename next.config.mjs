// @ts-check

/** @type {import('next').NextConfig} */
export const config = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    // typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "**.maximousblk.me",
        protocol: "https",
      },
      {
        hostname: "s3.us-west-2.amazonaws.com",
        protocol: "https",
        port: '',
        pathname: "/secure.notion-static.com/**",
      },
      {
        hostname: "images.weserv.nl",
        protocol: "https",
      },
      {
        hostname: "cdn.jsdelivr.net",
        protocol: "https",
      },
    ],
    minimumCacheTTL: 3600,
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
      {
        source: "/_umami/:path*",
        destination: "https://analytics.maximousblk.me/:path*",
      },
      {
        source: "/_umami_cloud/:path*",
        destination: "https://analytics.umami.is/:path*",
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

export default config;
