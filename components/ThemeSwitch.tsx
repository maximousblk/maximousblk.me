"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import Icon from "@/components/FeatherIcons";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  return (
    <button
      aria-label="Toggle Dark Mode"
      disabled={!mounted}
      type="button"
      className={
        "h-10 w-10 rounded border border-transparent p-3 text-gray-900 hover:border-gray-500/10 hover:bg-gray-200/30 dark:text-gray-100 dark:hover:bg-gray-700/30 " +
        (mounted ? "cursor-pointer" : "cursor-not-allowed")
      }
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {(mounted && <Icon name={resolvedTheme === "dark" ? "FiSun" : "FiMoon"} className="h-4 w-4 text-gray-800 dark:text-gray-200" />) || (
        <Icon name="FiLoader" className="h-4 w-4 animate-spin text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
}
