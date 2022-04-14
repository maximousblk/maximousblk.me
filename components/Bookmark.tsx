import Link from "@/components/Link";
import Image from "next/image";

export interface BookmarkProps {
  title: string;
  description: string;
  url: string;
  image?: { url: string; width: number; height: number };
  caption?: React.ReactNode;
}

export function Bookmark({ title, description, url, image, caption }: BookmarkProps) {
  return (
    <figure className="my-6">
      <Link
        href={url}
        className="flex justify-between overflow-hidden rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:no-underline dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
      >
        <div className="flex w-full flex-col space-y-2 p-3">
          <p className="m-0 font-medium text-gray-900 line-clamp-1 dark:text-gray-100">{title}</p>
          <p className="m-0 text-sm text-gray-600 line-clamp-1 dark:text-gray-400">{description}</p>
          <p className="m-0 font-mono text-xs text-gray-500 line-clamp-1">{url}</p>
        </div>
        {image?.url && image?.height && image?.width && (
          <div className="hidden max-h-[6.5rem] w-60 sm:flex">
            <Image
              alt=""
              height={image.height}
              width={image.width}
              src={"https://images.weserv.nl/?url=" + image.url}
              className="!rounded-none object-cover"
            />
          </div>
        )}
      </Link>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default Bookmark;
