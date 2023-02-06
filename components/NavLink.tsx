"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import Emoji from "@/components/Emoji";
import { nameToEmoji } from "gemoji";

export default function NavLink({ href, emoji, name }: { href: string; emoji: string; name: string }) {
  let pathname = usePathname();

  return (
    <div className="my-1 inline-block">
      <Link
        href={href}
        className="flex items-center justify-between rounded border border-transparent px-2.5 py-1.5 text-gray-800 hover:border-gray-500/10 hover:bg-gray-200/30 dark:text-gray-200 dark:hover:bg-gray-700/30"
      >
        <span className="flex select-none items-center justify-between pr-2 text-sm" aria-hidden="true">
          <Emoji priority emoji={nameToEmoji[emoji]} />
        </span>
        <span className={pathname == href ? "text-gray-900 underline underline-offset-2 dark:text-gray-50" : ""}>{name}</span>
      </Link>
    </div>
  );
}
