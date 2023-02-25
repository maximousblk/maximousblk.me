import "@/styles/global.scss";

import { Inter, Lora, JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next/types";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const ibmPlexMono = IBM_Plex_Mono({ weight: "400", subsets: ["latin"], variable: "--font-mono2" });

import "katex/dist/katex.min.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import ThemeContext from "@/components/ThemeContext";
import config from "@/config";
import seo from "@/next-seo.config";

export const revalidate = 3600;

export const fetchCache = "force-cache";

export async function generateMetadata({ params, searchParams }): Promise<Metadata> {
  console.debug("generateMetadata", { params, searchParams });

  return {
    title: {
      default: seo.title,
      template: seo.titleTemplate,
    },
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
    description: seo.description,
    openGraph: seo.openGraph,
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.openGraph.images,
      creator: "@" + config.username,
      site: "@" + config.username,
    },
    themeColor: config.themeColor,
    creator: config.name,
    appleWebApp: {
      capable: true,
      startupImage: "/favicons/apple-touch-icon.png",
      statusBarStyle: "black-translucent",
      title: config.name,
    },
    applicationName: config.name,
    authors: {
      name: config.name,
      url: config.baseUrl,
    },
    manifest: config.baseUrl + "/webmanifest.json",
    formatDetection: {
      telephone: false,
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
    },
    generator: "Next.js",
    other: {
      "msapplication-TileColor": config.themeColor,
      "google-site-verification": "M4wcsX_DZ9CkpAzZ5rNmUbk1JWl3aLqgxIfB4YG-ozI",
      "X-UA-Compatible": "IE=edge",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body
        className={
          "bg-white font-sans text-black dark:bg-gray-900 dark:text-white " +
          [inter.variable, lora.variable, jetbrainsMono.variable, ibmPlexMono.variable].join(" ")
        }
      >
        <ThemeContext>
          <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
            <Navbar />
            <div className="flex flex-1 flex-col justify-center bg-white px-4 dark:bg-gray-900 sm:px-8">{children}</div>
            <Footer />
          </div>
        </ThemeContext>
        <Analytics />
      </body>
    </html>
  );
}
