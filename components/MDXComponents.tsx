import Link from "next/link";
import Image from "next/image";
// import Tweet from "react-tweet-embed";

import Icon from "@/components/FeatherIcons";
// import ProsCard from "@/components/ProsCard";
// import ConsCard from "@/components/ConsCard";

const LinkIcon = ({ name, children }) => {
  if (typeof children == "string") {
    return <Icon name={name} size={16} className="inline-block ml-1 mb-1 text-gray-500 dark:text-coolGray-500" />;
  } else {
    return null;
  }
};

const CustomLink = ({ href, children, ...props }) => {
  const isAnchorHref = href && href.startsWith("#");
  const isMailHref = href && href.startsWith("mailto:");
  const isFootNoteHref = href && href.startsWith("#fn");
  const isRelativeHref = href && (href.startsWith("/") || href.startsWith("."));

  const baseStyle = "hover:bg-gray-100 dark:hover:bg-coolGray-800 rounded";

  const BaseIconLink = ({ href, icon, children, ...props }) => {
    return (
      <a href={href} className={baseStyle} {...props}>
        {children}
        <LinkIcon name={icon}>{children}</LinkIcon>
      </a>
    );
  };

  if (isAnchorHref) {
    return (
      <BaseIconLink href={href} icon="Hash">
        {children}
      </BaseIconLink>
    );
  } else if (isMailHref) {
    return (
      <BaseIconLink href={href} icon="Mail">
        {children}
      </BaseIconLink>
    );
  } else if (isRelativeHref) {
    return (
      <Link href={href}>
        <a className={baseStyle} {...props}>
          {children}
          <LinkIcon name="Link">{children}</LinkIcon>
        </a>
      </Link>
    );
  } else if (isFootNoteHref) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  } else {
    return (
      <BaseIconLink href={href} icon="Hash" target="_blank" rel="noopener noreferrer">
        {children}
      </BaseIconLink>
    );
  }
};

const MDXComponents = {
  Image,
  // Tweet,
  // ConsCard,
  // ProsCard,
  a: CustomLink
};

export default MDXComponents;
