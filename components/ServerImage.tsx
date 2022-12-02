import NextImage, { ImageProps } from "next/image";
import Image from "@/components/ClientImage";
import { getImageInfo } from "@/lib/utils";
import base64url from "base64url";
import errorImage from "@/public/image_error.png";

export default async function ServerImage({
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
    let imageinfo = await getImageInfo(src);

    if (imageinfo) {
      image = imageinfo;
    } else {
      return <NextImage src={errorImage} alt={alt} aria-label="Unexpected error occured while loading image" />;
    }
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
