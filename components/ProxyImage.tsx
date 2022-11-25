import Image, { ImageProps } from "next/image";
import { getImageInfo } from "@/lib/utils";
import base64url from "base64url";

export default async function ProxyImage({
  src,
  alt,
  height,
  width,
  ...props
}: Omit<ImageProps, "height" | "width" | "quality" | "placeholder" | "blurDataURL"> & {
  src: string;
  alt: string;
  height?: number;
  width?: number;
}) {
  let image: {
    height: number;
    width: number;
    blurDataURL: string;
  } = { height: 0, width: 0, blurDataURL: "" };

  if (!height || !width) {
    image = await getImageInfo(src);
  }

  if (!src.startsWith("https://proxy.maximousblk.me/rewrite?url=")) {
    src = "https://proxy.maximousblk.me/rewrite?url=" + base64url(src);
  }

  return (
    <Image
      quality={90}
      height={height || image.height}
      width={width || image.width}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      src={src}
      alt={alt}
      {...props}
    />
  );
}
