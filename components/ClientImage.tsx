"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

import errorImage from "@/public/image_error.png";

export default function ClientImage({ src, alt, ...props }: ImageProps) {
  const [imgSrc, setSrc] = useState(src);
  const [err, setErr] = useState(false);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      {...props}
      aria-label={err ? "Unexpected error occured while loading image" : props["aria-label"]}
      onError={() => {
        setSrc(errorImage.src);
        setErr(true);
      }}
    />
  );
}
