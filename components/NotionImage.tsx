import ServerImage from "@/components/ServerImage";

export default function NotionImage({ src, alt, caption }) {
  return (
    <figure>
      <div className="mx-auto flex w-fit overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-900 dark:bg-gray-800">
        <ServerImage src={src} alt={alt} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
