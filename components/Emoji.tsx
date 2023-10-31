import { memo } from "react";
import Image, { ImageProps } from "next/image";

export function Emoji({
  emoji,
  size = 18,
  ...props
}: { emoji: string; size?: number } & Omit<ImageProps, "src" | "alt" | "height" | "width">) {
  return (
    <Image
      src={`https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${emoji}_color.svg`}
      height={size}
      width={size}
      aria-hidden="true"
      alt=""
      {...props}
    />
  );
}

export default memo(Emoji);
