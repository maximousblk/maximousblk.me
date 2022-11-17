import "@/styles/global.scss";
import "@fontsource/inter";
import "@fontsource/lora";
import "@fontsource/jetbrains-mono";
import "katex/dist/katex.min.css";

import { ThemeProvider } from "next-themes";

import Container from "@/components/Container";
import ThemeContext from "./theme";

export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeContext>
          <Container>
            <main className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">{children}</main>
          </Container>
        </ThemeContext>
      </body>
    </html>
  );
}
