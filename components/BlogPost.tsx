import Link from "next/link";
import { format } from "date-fns";

interface Attributes {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date | number;
}

export default function BlogPost({ title, description, slug, publishedAt }: Attributes) {
  return (
    <div>
      <Link href={`/posts/${slug}`} className="w-full">
        <div className="mb-4 mt-8 w-full">
          <div className="flex flex-col justify-between md:flex-row">
            <h4 className="mb-2 w-full text-lg font-medium text-gray-900 dark:text-gray-100 md:text-xl">{title}</h4>
            <p className="mb-4 w-32 text-left font-mono text-gray-500 dark:text-gray-500 md:mb-0 md:text-right">
              {publishedAt && format(publishedAt, "MMM, yyy")}
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </Link>
    </div>
  );
}
