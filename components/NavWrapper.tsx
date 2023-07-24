"use client";

import { useEffect, useState } from "react";

export default function NavWrapper({ children }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Navigation Menu"
      className={
        "sticky top-0 z-10 mx-auto mb-16 flex w-full flex-nowrap justify-center " +
        "bg-white !bg-opacity-40 p-2 backdrop-blur-md dark:bg-gray-950 print:hidden " +
        (scrollY > 50 ? "border-b border-gray-200/40 dark:border-gray-900/50" : "")
      }
    >
      {children}
    </nav>
  );
}
