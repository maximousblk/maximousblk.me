import { nameToEmoji } from "gemoji";
import Link from "next/link";

import Twemoji from "@/components/Twemoji";
import ThemeSwitch from "@/components/ThemeSwitch";
import NavWrapper from "@/components/NavWrapper";
import config from "@/config";

export default function Navbar() {
  return (
    <NavWrapper>
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
        <ThemeSwitch />
      </div>
    </NavWrapper>
  );
}
