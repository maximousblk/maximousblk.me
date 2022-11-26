import "@/styles/global.scss";

import "@fontsource/inter";
import "@fontsource/lora";
import "@fontsource/jetbrains-mono";
import "@fontsource/ibm-plex-mono"

import "katex/dist/katex.min.css";

import Container from "@/components/Container";
import Analytics from "@/components/Analytics";

import ThemeContext from "./theme";

export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        <ThemeContext>
          <Container>{children}</Container>
        </ThemeContext>
        <Analytics />
      </body>
    </html>
  );
}
