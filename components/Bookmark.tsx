import Link from "@/components/Link";
import ClientImage from "@/components/ClientImage";
import { unfurl } from "unfurl.js";
import config from "@/config";

async function getData(url: string) {
  const epoch = Math.floor(Date.now() / 1000);
  // console.time(`[unfurl] getData ${url} ${epoch}`);

  const og_data = await unfurl(url, {
    fetch: (input) => {
      // console.debug("[unfurl] fetch", input);

      return fetch(input, {
        next: { revalidate: 3600 },
      });
    },
  });

  // console.timeEnd(`[unfurl] getData ${url} ${epoch}`);

  return {
    title: og_data.twitter_card?.title || og_data.open_graph?.title || og_data.title || null,
    description: og_data.open_graph?.description || og_data.description || null,
    image: og_data.open_graph?.images?.[0] || null,
  };
}

export async function Bookmark({ url, caption }: { url: string; caption?: JSX.Element }) {
  const { title, description, image } = await getData(url);
  return (
    <figure className="my-6">
      <Link
        href={url}
        className="flex justify-between overflow-hidden rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:no-underline dark:border-gray-900 dark:bg-gray-950 dark:hover:bg-gray-900"
      >
        <div className="flex w-full flex-col space-y-2 p-3">
          <p className="m-0 line-clamp-1 font-medium text-gray-900 dark:text-gray-100">{title}</p>
          <p className="m-0 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          <p className="m-0 line-clamp-1 font-mono text-xs text-gray-500">{url}</p>
        </div>
        {image?.url && (
          <div className="hidden max-h-[6.5rem] w-60 sm:flex">
            <ClientImage
              alt={title}
              src={image.url}
              width={image.width || 250}
              height={image.height || 100}
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
