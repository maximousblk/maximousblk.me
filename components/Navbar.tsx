"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { nameToEmoji } from "gemoji";
import Link from "next/link";

import Icon from "@/components/FeatherIcons";
import Twemoji from "@/components/Twemoji";
import config from "@/config";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  return (
    <nav
      aria-label="Navigation Menu"
      className="sticky top-0 z-10 mx-auto mb-16 flex w-full flex-nowrap justify-center bg-white !bg-opacity-50 p-2 backdrop-blur dark:bg-gray-900 print:hidden"
    >
      <div className="flex w-full max-w-6xl flex-nowrap items-center justify-between">
        <div className="flex flex-shrink-0">
          {config.nav.map(({ name, emoji, href }, i, a) => (
            <div key={name} className="my-3 inline-block">
              <Link
                href={href}
                className="flex items-center justify-between rounded px-2.5 py-1.5 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <span className="flex select-none items-center justify-between pr-2 text-sm" aria-hidden="true">
                  <Twemoji priority emoji={nameToEmoji[emoji]} />
                </span>
                <span>{name}</span>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-shrink-0 space-x-2">
          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="h-10 w-10 rounded p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {mounted && <Icon name={resolvedTheme === "dark" ? "FiSun" : "FiMoon"} className="h-4 w-4 text-gray-800 dark:text-gray-200" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
