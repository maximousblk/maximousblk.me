import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

import Icon from "@/components/FeatherIcons";
import config from "@/data/config";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky-nav flex justify-between items-center max-w-6xl w-full p-2 mb-16 mx-auto bg-white dark:bg-coolGray-900">
      <div>
        {config.nav.map(({ name, href }, i, a) => (
          <div key={name} className="inline-block m-0">
            <Link href={href}>
              <a className="py-2 px-2.5 rounded text-gray-900 dark:text-coolGray-100 hover:bg-gray-100 dark:hover:bg-coolGray-800">
                {name}
              </a>
            </Link>
            {i + 1 < a.length && <span className="text-gray-500 dark:text-coolGray-300 select-none px-1.5">·</span>}
          </div>
        ))}
      </div>
      <button
        aria-label="Toggle Dark Mode"
        type="button"
        className="hover:bg-gray-100 dark:hover:bg-coolGray-800 rounded p-3 h-10 w-10"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {mounted && <Icon name={resolvedTheme === "dark" ? "Sun" : "Moon"} className="h-4 w-4 text-gray-800 dark:text-coolGray-200" />}
      </button>
    </nav>
  );
}
