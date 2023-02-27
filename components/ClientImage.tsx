"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import base64url from "base64url";

import errorImage from "@/public/image_error.png";

export default function ClientImage({ src, alt, errSrc, ...props }: ImageProps & { errSrc?: string }) {
  if (typeof src == "string" && !src.startsWith("https://proxy.maximousblk.me/rewrite?url=")) {
    src = "https://proxy.maximousblk.me/rewrite?url=" + base64url(src);
  }

  const [imgSrc, setSrc] = useState(src);
  const [err, setErr] = useState(false);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      {...props}
      aria-label={err ? "Unexpected error occured while loading image" : props["aria-label"]}
      onError={() => {
        setSrc(errSrc || errorImage.src);
        setErr(true);
      }}
    />
  );
}
