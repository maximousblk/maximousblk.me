import { memo } from "react";
import Image, { ImageProps } from "next/image";

export function getEmojiLink(emoji: string) {
  return `https://twemoji.maxcdn.com/v/latest/svg/${emoji.codePointAt(0).toString(16)}.svg`;
}

export function Twemoji({ emoji, size = 18, ...props }: { emoji: string; size?: number } & Omit<ImageProps, "src" | "height" | "width">) {
  return <Image src={getEmojiLink(emoji)} height={size} width={size} aria-hidden="true" alt="" {...props} />;
}

export default memo(Twemoji);
