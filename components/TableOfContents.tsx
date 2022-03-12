import Link from "@/components/Link";
import { slugify } from "@/lib/utils";

export interface TableOfContentsItem {
  title: string;
  type?: string;
  children?: TableOfContentsItem[];
}

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  items: TableOfContentsItem[];
};

export default function TableOfContents({ items, className = "" }: Props) {
  return (
    <nav id="_toc" aria-label="Table of contents">
      <details className={"px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 " + className}>
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

export { TableOfContents };
