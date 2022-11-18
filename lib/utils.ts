import slugy from "slugify";
import readingTime, { type ReadTimeResults } from "reading-time";
import type { NotionBlock } from "@/lib/types";
import { cache } from "react";
import { getPlaiceholder } from "plaiceholder";

export function slugify(text: string[]) {
  return slugy(text.join(""), { lower: true });
}

export function getReadingTime(blocks: NotionBlock[]): ReadTimeResults {
  const words: string = blocks.reduce((acc, block) => {
    if (block[block.type].rich_text?.length) {
      return acc + block[block.type].rich_text.map(({ plain_text }) => plain_text).join(" ");
    }
    return acc;
  }, "");

  return readingTime(words);
}

async function getPlaiceholderInfo(src: string) {
  const {
    base64,
    img: { height, width },
  } = await getPlaiceholder(src, { size: 64 });

  return {
    height,
    width,
    blurDataURL: base64,
  };
}

export const getImageInfo = cache(getPlaiceholderInfo);
