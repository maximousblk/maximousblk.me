import ProxyImage from "@/components/ProxyImage";

export default function NotionImage({ src, alt, caption }) {
  return (
    <figure>
      <div className="mx-auto flex w-fit overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
        {/* @ts-ignore */}
        <ProxyImage src={src} alt={alt} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
