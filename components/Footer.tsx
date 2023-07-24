import Link from "next/link";

import Icon from "@/components/FeatherIcons";
import config from "@/config";

const Social = ({ name, icon, href }) => {
  return (
    <a
      className="rounded p-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{name}</span>
      <Icon name={icon} size={20} />
    </a>
  );
};

export default function Footer() {
  return (
    <footer className="mb-8 flex flex-col items-center print:hidden">
      <div className="mb-4 flex space-x-2">
        {config.footer.social.map(({ name, icon, href }) => (
          <Social name={name} icon={icon} href={href} key={name} />
        ))}
      </div>
      <div className="space-x-1">
        {config.footer.links.map(({ name, href }) => (
          <Link
            href={href}
            key={name}
            className="rounded-sm border border-transparent px-1.5 py-1 font-mono text-sm text-gray-600 hover:border-gray-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:border-gray-800 dark:hover:bg-gray-900"
            aria-label={name}
          >
            /{name}
          </Link>
        ))}
      </div>
    </footer>
  );
}
