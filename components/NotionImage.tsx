import Image from "next/image";
import { getImageInfo } from "@/lib/utils";

export default async function NotionImage({ src, alt, caption }) {
  const { blurDataURL, height, width } = await getImageInfo(src);

  return (
    <figure>
      <div className="mx-auto flex w-fit overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
        <Image
          quality={90}
          height={height}
          width={width}
          placeholder="blur"
          blurDataURL={blurDataURL}
          src={"https://proxy.maximousblk.me/?rewrite=" + Buffer.from(src).toString("base64")}
          alt={alt}
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
