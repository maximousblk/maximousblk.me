"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Script from "next/script";

export default function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <Script
        async
        defer
        strategy="afterInteractive"
        src="https://analytics.maximousblk.me/umami.js"
        data-website-id="d565f770-836d-42fb-9fe3-0946633cdb49"
        data-domains="maximousblk.me"
        data-cache="true"
      />
    </>
  );
}
