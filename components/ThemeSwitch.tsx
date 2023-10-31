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
      data-umami-event="Theme Change"
      data-umami-event-theme={resolvedTheme}
      className={
        "group h-10 w-10 rounded border border-transparent p-3 hover:border-gray-600/20 hover:bg-accent-cool-200/40 dark:hover:bg-accent-warm-900/20 " +
        (mounted ? "cursor-pointer" : "cursor-not-allowed")
      }
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted && (
        <Icon
          name={resolvedTheme === "dark" ? "FiSun" : "FiMoon"}
          className="h-4 w-4 text-gray-800 group-hover:animate-wiggle group-hover:text-accent-cool-800 dark:text-gray-200 dark:group-hover:animate-spin-slow dark:group-hover:text-accent-warm-400"
        />
      )}
    </button>
  );
}
