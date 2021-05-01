const withPWA = require("next-pwa");

module.exports = withPWA({
  future: {
    webpack5: true,
    strictPostcssConfiguration: true
  },
  images: {
    domains: [
      "i.scdn.co", // Spotify Album Art
      "pbs.twimg.com", // Twitter Profile Picture
      "cdn.maximousblk.now.sh" // Personal CDN
    ]
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
    dest: "public",
    fallbacks: {
      document: "/_offline",
    }
  },
  async rewrites() {
    return [
      {
        source: "/rss/:path*",
        destination: "/api/rss/:path*"
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
