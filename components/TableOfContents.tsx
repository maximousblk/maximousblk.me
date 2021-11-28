import Link from "@/components/Link";

export interface TableOfContentsItem {
  title: string;
  type?: string;
  children?: TableOfContentsItem[];
}

export default function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.title}>
          <Link href={"#" + slugify([item.title])}>{item.title}</Link>
          {item.children && <TableOfContents items={item.children} />}
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
    .replace(/\s+/g, "_")
    .replace(/[^\w-]+/g, "")
    .replace(/__+/g, "_")
    .replace(/^_+/, "")
    .replace(/_+$/, "");
}

export { TableOfContents, slugify };
