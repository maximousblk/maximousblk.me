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
    <nav className="sticky-nav flex flex-nowrap justify-between items-center max-w-6xl w-full p-2 mb-16 mx-auto bg-white dark:bg-gray-900">
      <div className="flex flex-shrink-0">
        {config.nav.map(({ name, emoji, href }, i, a) => (
          <div key={name} className="inline-block my-3">
            <Link href={href}>
              <a className="flex justify-between items-center px-2.5 py-1.5 rounded text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="hidden md:flex justify-between items-center select-none text-sm pr-2" aria-hidden="true">
                  <Twemoji emoji={nameToEmoji[emoji]} />
                </span>
                {name}
              </a>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex flex-shrink-0 space-x-2">
        <button
          aria-label="Toggle Dark Mode"
          type="button"
          className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-3 h-10 w-10"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {mounted && <Icon name={resolvedTheme === "dark" ? "Sun" : "Moon"} className="h-4 w-4 text-gray-800 dark:text-gray-200" />}
        </button>
      </div>
    </nav>
  );
}
