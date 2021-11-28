import Link from "@/components/Link";

export interface BookmarkProps {
  title: string;
  description: string;
  url: string;
  image?: { url: string; width: number; height: number };
}
export function Bookmark({ title, description, url, image }: BookmarkProps) {
  return (
    <figure className="flex rounded overflow-hidden border bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800">
      <Link href={url} className="flex flex-col grow space-y-2 p-3">
        <p className="m-0 inline-block font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{title}</p>
        <p className="m-0 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>
        <p className="m-0 font-mono text-xs text-gray-500">{url}</p>
      </Link>
    </figure>
  );
}

export default Bookmark;
