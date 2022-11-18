import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";

export default async function NotionImage({ src, alt, caption }) {
  const {
    base64,
    img: { height, width },
  } = await getPlaiceholder(src, { size: 64 });

  return (
    <figure>
      <div className="mx-auto flex w-fit overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
        <Image
          quality={90}
          height={height}
          width={width}
          placeholder="blur"
          blurDataURL={base64}
          src={"https://proxy.maximousblk.me/?rewrite=" + Buffer.from(src).toString("base64")}
          alt={alt}
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
