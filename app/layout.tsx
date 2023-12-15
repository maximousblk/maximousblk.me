import "@/styles/global.scss";

import { Inter, Lora, JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next/types";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const ibmPlexMono = IBM_Plex_Mono({ weight: "400", subsets: ["latin"], variable: "--font-mono2" });

import "katex/dist/katex.min.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { SpeedInsights } from '@vercel/speed-insights/next';
import ThemeContext from "@/components/ThemeContext";
import config from "@/config";
import seo from "@/next-seo.config";

export const revalidate = 3600;

export const fetchCache = "force-cache";

export const metadata: Metadata = {
  metadataBase: new URL(config.baseUrl),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  creator: config.name,
  applicationName: config.name,
  authors: {
    name: config.name,
    url: config.baseUrl,
  },
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    url: config.baseUrl,
    siteName: config.name,
    images: seo.openGraph.images,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: seo.openGraph.images,
    creator: "@" + config.username,
    site: "@" + config.username,
  },
  manifest: config.baseUrl + "/webmanifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
    other: [
      {
        url: "/favicons/favicon-32x32.png",
        sizes: "32x32",
      },
      {
        url: "/favicons/favicon-16x16.png",
        sizes: "16x16",
      },
      {
        url: "/favicons/safari-pinned-tab.svg",
        sizes: "180x180",
        rel: "mask-icon",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    startupImage: "/favicons/apple-touch-icon.png",
    statusBarStyle: "black-translucent",
    title: config.name,
  },
  formatDetection: {
    telephone: false,
  },

  generator: "Next.js",
  other: {
    "msapplication-TileColor": config.themeColor,
    "google-site-verification": "M4wcsX_DZ9CkpAzZ5rNmUbk1JWl3aLqgxIfB4YG-ozI",
    "X-UA-Compatible": "IE=edge",
    "og:image": seo.openGraph.images[0].url,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: config.themeColor },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body
        className={
          "bg-white font-sans text-black dark:bg-gray-950 dark:text-white " +
          "selection:bg-gray-800 selection:text-accent-warm-100 selection:dark:bg-gray-100 selection:dark:text-accent-cool-900 " +
          [inter.variable, lora.variable, jetbrainsMono.variable, ibmPlexMono.variable].join(" ")
        }
      >
        <ThemeContext>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 flex-col justify-center px-4 sm:px-8">{children}</div>
            <Footer />
          </div>
        </ThemeContext>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
