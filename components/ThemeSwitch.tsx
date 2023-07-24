"use client";

import { useTheme } from "next-themes";

import Icon from "@/components/FeatherIcons";
import useMounted from "@/lib/useMounted";

export default function ThemeSwitch() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle Dark Mode"
      disabled={!mounted}
      type="button"
      className={
        "h-10 w-10 rounded border border-transparent p-3 text-gray-900 hover:border-gray-500/10 hover:bg-gray-200/30 dark:text-gray-100 dark:hover:bg-gray-800/30 " +
        (mounted ? "cursor-pointer" : "cursor-not-allowed")
      }
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted && <Icon name={resolvedTheme === "dark" ? "FiSun" : "FiMoon"} className="h-4 w-4 text-gray-800 dark:text-gray-200" />}
    </button>
  );
}
