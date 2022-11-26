import "@/styles/global.scss";
import "katex/dist/katex.min.css";

import { Inter, JetBrains_Mono, IBM_Plex_Mono } from "@next/font/google";

import Container from "@/components/Container";
import Analytics from "@/components/Analytics";

import ThemeContext from "./theme";

const font_sans = Inter({ variable: "--next-font-sans" });
const font_mono = JetBrains_Mono({ variable: "--next-font-mono" });
const font_mono2 = IBM_Plex_Mono({ weight: "400", variable: "--next-font-mono2" });

export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${font_sans.variable} ${font_mono.variable} ${font_mono2.variable} bg-white text-black dark:bg-gray-900 dark:text-white`}
      >
        <ThemeContext>
          <Container>{children}</Container>
        </ThemeContext>
        <Analytics />
      </body>
    </html>
  );
}
