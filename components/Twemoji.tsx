import { memo } from "react";
import Image, { ImageProps } from "next/image";

export function Twemoji({ emoji, size = 16, ...props }: { emoji: string; size?: number } & Omit<ImageProps, "src" | "height" | "width">) {
  return (
    <Image
      src={`https://twemoji.maxcdn.com/v/latest/svg/${emoji.codePointAt(0).toString(16)}.svg`}
      height={size}
      width={size}
      aria-hidden="true"
      alt={emoji}
      priority
      {...props}
    />
  );
}

export default memo(Twemoji);
