const withPWA = require("next-pwa");

module.exports = withPWA({
  experimental: {
    nftTracing: true // Fix for `ENOENT: no such file or directory, scandir '/var/task/<path>'`
  },
  reactStrictMode: true,
  images: {
    domains: ["cdn.maximousblk.me", "octodex.github.com"]
  },
  webpack: (config, { dev, isServer }) => {
    // Replace React with Preact only in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat"
      });
    }

    return config;
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
});
