import "@/styles/global.scss";
import "@fontsource/inter";
import "@fontsource/lora";
import "@fontsource/jetbrains-mono";
import "katex/dist/katex.min.css";

import Container from "@/components/Container";
import ThemeContext from "./theme";

export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeContext>
          <Container>{children}</Container>
        </ThemeContext>
      </body>
    </html>
  );
}
