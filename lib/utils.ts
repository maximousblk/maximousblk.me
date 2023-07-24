import slugy from "slugify";
import readingTime, { type ReadTimeResults } from "reading-time";
import type { NotionBlock } from "@/lib/types";
import { cache } from "react";
import { getPlaiceholder } from "plaiceholder";
import base64url from "base64url";

export function slugify(text: string) {
  return slugy(text, { lower: true });
}

export function getReadingTime(blocks: NotionBlock[]): ReadTimeResults {
  const words: string = blocks.reduce((acc, block) => {
    if (block[block.type].rich_text?.length) {
      return acc + getPlainText(block[block.type].rich_text);
    }
    return acc;
  }, "");

  return readingTime(words);
}

export const getImageInfo = cache(_getImageInfo);
async function _getImageInfo(src: string) {
  try {
    const timerName = src
      .replace("s3.us-west-2.amazonaws.com/secure.notion-static.com", "notion.aws")
      .replace("proxy.maximousblk.me/rewrite?url=", "rewrite.proxy")
      .substring(0, Math.min(80, src.length));

    const epoch = Math.floor(Date.now() / 1000);
    console.time(`[notion] getImageInfo ${timerName} ${epoch}`);

    const {
      base64,
      img: { height, width },
    } = await getPlaiceholder("https://proxy.maximousblk.me/rewrite?url=" + base64url(src), { size: 64 });

    console.timeEnd(`[notion] getImageInfo ${timerName} ${epoch}`);

    return {
      height,
      width,
      blurDataURL: base64,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

const notion_color = {
  default: "",

  gray: "!text-gray-500 !dark:text-gray-400",
  brown: "!text-stone-500 !dark:text-stone-400",
  orange: "!text-orange-500 !dark:text-orange-400",
  yellow: "!text-amber-500 !dark:text-yellow-400",
  green: "!text-emerald-500 !dark:text-emerald-400",
  blue: "!text-blue-500 !dark:text-sky-400",
  purple: "!text-indigo-500 !dark:text-indigo-400",
  pink: "!text-pink-500 !dark:text-pink-400",
  red: "!text-rose-500 !dark:text-rose-400",

  gray_background: "!bg-opacity-10 !bg-gray-500 !border-gray-200 dark:!border-gray-900",
  brown_background: "!bg-opacity-10 !bg-stone-500 !border-stone-200 dark:!border-stone-900",
  orange_background: "!bg-opacity-10 !bg-orange-500 !border-orange-200 dark:!border-orange-900",
  yellow_background: "!bg-opacity-10 !bg-yellow-500 !border-yellow-200 dark:!border-yellow-900",
  green_background: "!bg-opacity-10 !bg-emerald-500 !border-emerald-200 dark:!border-emerald-900",
  blue_background: "!bg-opacity-10 !bg-sky-500 !border-sky-200 dark:!border-sky-900",
  purple_background: "!bg-opacity-10 !bg-indigo-500 !border-indigo-200 dark:!border-indigo-900",
  pink_background: "!bg-opacity-10 !bg-pink-500 !border-pink-200 dark:!border-pink-900",
  red_background: "!bg-opacity-10 !bg-rose-500 !border-rose-200 dark:!border-rose-900",
};

export function getNotionColorClass(anotation: string) {
  return notion_color[anotation] || "";
}

export function getPlainText(blocks: { plain_text: string }[]): string {
  return blocks?.map(({ plain_text }) => plain_text).join("");
}

function* generateBlockID() {
  let i = 1;
  while (true) {
    yield `notion_block_${i++}`;
  }
}

export const blockID = generateBlockID();
