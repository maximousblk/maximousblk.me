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
        strategy="lazyOnload"
        src="/_umami/script.js"
        data-website-id="08fa52f2-a0b2-4351-82eb-5dad04d73afe"
        data-cache="true"
      />
      <Script
        async
        defer
        strategy="lazyOnload"
        src="/_umami_cloud/script.js"
        data-website-id="03fe92d0-876b-4862-b050-a35a8e6daff1"
        data-cache="true"
      />
    </>
  );
}
