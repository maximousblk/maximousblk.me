import Link from "next/link";

interface Attributes {
  title: string;
  description: string;
  slug: string;
}

const FunctionCard = ({ title, description, slug, ...rest }: Attributes) => {
  return (
    <Link href={`/gists/${slug}`}>
      <a className="border border-grey-200 dark:border-gray-800 rounded p-4 w-full" {...rest}>
        <h3 className="text-lg font-bold text-left mt-2 text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mt-1 text-gray-700 dark:text-gray-400">{description}</p>
      </a>
    </Link>
  );
};

export default FunctionCard;
