"use client";

import { ThemeProvider } from "next-themes";

export default function ThemeContext({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
