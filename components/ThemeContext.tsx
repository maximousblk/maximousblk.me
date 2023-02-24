"use client";

import { ThemeProvider } from "next-themes";

export default function ThemeContext({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem enableColorScheme>
      {children}
    </ThemeProvider>
  );
}
