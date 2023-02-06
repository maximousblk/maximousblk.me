import "@/styles/global.scss";

import { Inter, Lora, JetBrains_Mono, IBM_Plex_Mono } from "@next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const ibmPlexMono = IBM_Plex_Mono({ weight: "400", subsets: ["latin"], variable: "--font-mono2" });

import "katex/dist/katex.min.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import ThemeContext from "@/components/ThemeContext";

export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
