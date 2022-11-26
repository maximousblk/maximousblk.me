import "@/styles/global.scss";

import "@fontsource/inter";
import "@fontsource/lora";
import "@fontsource/jetbrains-mono";
import "@fontsource/ibm-plex-mono";

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
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
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
