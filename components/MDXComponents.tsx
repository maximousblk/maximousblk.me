import Link from "next/link";
import Image from "next/image";

import Icon from "@/components/FeatherIcons";

function LinkIcon({ name }) {
  return <Icon name={name} size={16} className="inline-block ml-1 mb-1 text-gray-500 dark:text-coolGray-500" />;
}

export function CustomLink({ href, children, ...props }) {
  const isAnchorHref = href && href.startsWith("#");
  const isMailHref = href && href.startsWith("mailto:");
  const isFootNoteHref = href && href.startsWith("#fn");
  const isRelativeHref = href && (href.startsWith("/") || href.startsWith("."));

  const baseStyle = "px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-coolGray-800 rounded";

  function BaseIconLink({ href, icon, children, ...props }) {
    return (
      <a href={href} className={baseStyle} {...props}>
        {children}
        {icon && <LinkIcon name={icon} />}
      </a>
    );
  }

  if (isMailHref) {
    return (
      <BaseIconLink href={href} icon="Mail" {...props}>
        {children}
      </BaseIconLink>
    );
  } else if (isRelativeHref) {
    return (
      <Link href={href}>
        <a className={baseStyle} {...props}>
          {children}
          <LinkIcon name="Link" />
        </a>
      </Link>
    );
  } else if (isFootNoteHref) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  } else if (isAnchorHref) {
    return (
      <BaseIconLink href={href} icon="Hash" {...props}>
        {children}
      </BaseIconLink>
    );
  } else {
    return (
      <BaseIconLink href={href} icon={false} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </BaseIconLink>
    );
  }
}

export function Quote({ author, children, ...props }) {
  return (
    <blockquote {...props}>
      <div className="quote relative">
        <p className="font-serif font-normal text-2xl italic pr-8">{children}</p>
        <p className="font-mono font-normal text-sm text-right">— {author}</p>
      </div>
    </blockquote>
  );
}

const MDXComponents = {
  Image,
  Quote,
  a: CustomLink
};

export default MDXComponents;
