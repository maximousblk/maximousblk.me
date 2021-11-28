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
    <figure>
      <Link
        href={url}
        className="rounded-md flex justify-between hover:no-underline overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
      >
        <div className="w-full flex flex-col space-y-2 p-3">
          <p className="m-0 inline-block font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{title}</p>
          <p className="m-0 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{description}</p>
          <p className="m-0 font-mono text-xs text-gray-500 line-clamp-1">{url}</p>
        </div>
        {image?.url && (
          <div className="hidden sm:flex w-64 max-h-28">
            <Image alt="" height={image.height} width={image.width} src={image.url} className="object-cover !rounded-none" />
          </div>
        )}
      </Link>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default Bookmark;
