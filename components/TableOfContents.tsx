import Link from "@/components/Link";

export interface TableOfContentsItem {
  title: string;
  type?: string;
  children?: TableOfContentsItem[];
}

export default function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
  return (
    <nav aria-label="Table of contents" className="print:hidden">
      <details id="_toc" className="px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <summary className="!m-0 cursor-pointer font-medium">Table of contents</summary>
        <hr className="mt-2 mb-4" />
        {items && <Contents items={items} />}
      </details>
    </nav>
  );
}

function Contents({ items }: { items: TableOfContentsItem[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.title}>
          <Link href={"#" + slugify([item.title])}>{item.title}</Link>
          {item.children && <Contents items={item.children} />}
        </li>
      ))}
    </ul>
  );
}

function slugify(text: string[]) {
  return text
    .join("")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export { TableOfContents, slugify };
