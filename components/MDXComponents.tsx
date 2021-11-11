import Link from "next/link";
import Image from "next/image";

export function CustomLink({ href, ...props }) {
  const isInternalLink = href && href.startsWith("/");
  const isAnchorLink = href && href.startsWith("#");

  const baseStyle = "hover:underline cursor-pointer";

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a className={baseStyle} {...props}>
          {props.children}
        </a>
      </Link>
    );
  } else if (isAnchorLink) {
    return <a href={href} className={baseStyle} {...props} />;
  } else {
    return <a href={href} className={baseStyle} target="_blank" rel="noopener noreferrer" {...props} />;
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
  a: CustomLink,
};

export default MDXComponents;
