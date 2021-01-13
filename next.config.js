const withPWA = require("next-pwa");

module.exports = withPWA({
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
    dest: "public"
  },
  async redirects() {
    return [
      {
        source: "/pgp",
        destination: "https://keybase.io/maximousblk/pgp_keys.asc",
        permanent: true
      }
    ];
  }
});
