import { memo } from "react";
import Image from "next/image";

export function Twemoji({ emoji, size = 16, ...props }: { emoji: string; size?: number }) {
  return (
    <Image
      src={`https://twemoji.maxcdn.com/v/latest/svg/${emoji.codePointAt(0).toString(16)}.svg`}
      height={size}
      width={size}
      alt={emoji}
      {...props}
    />
  );
}

export default memo(Twemoji);
