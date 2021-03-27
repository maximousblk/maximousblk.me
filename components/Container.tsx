import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

import Footer from "@/components/Footer";
import Icon from "@/components/FeatherIcons";
import config from "@/data/config";

export default function Container({ children }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white dark:bg-coolGray-900">
      <nav className="sticky-nav flex justify-between items-center max-w-4xl w-full p-8 my-0 md:my-8 mx-auto bg-white dark:bg-coolGray-900">
        <button
          aria-label="Toggle Dark Mode"
          type="button"
          className="hover:bg-gray-100 dark:hover:bg-coolGray-800 rounded p-3 h-10 w-10"
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
            document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === "light" ? "#111827" : "#FFFFFF");
          }}
        >
          {mounted && (
            <Icon name={theme === "light" ? "Moon" : "Sun"} className="h-4 w-4 text-gray-800 dark:text-coolGray-200" />
          )}
        </button>
        <div className="space-x-2">
          {config.nav.map(({ name, href }) => (
            <Link href={href} key={name}>
              <a className="py-2 px-3 rounded text-gray-900 dark:text-coolGray-100 hover:bg-gray-100 dark:hover:bg-coolGray-800">
                {name}
              </a>
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex flex-col justify-center bg-white dark:bg-coolGray-900 px-8">{children}</main>
      <Footer />
    </div>
  );
}
