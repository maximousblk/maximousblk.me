import NextLink from "next/link";

export function Link({ href, ...props }) {
  const isInternalLink = href && href.startsWith("/");
  const isAnchorLink = href && href.startsWith("#");

  const baseStyle = "hover:underline cursor-pointer";

  if (isInternalLink) {
    return (
      <NextLink href={href} className={baseStyle} {...props}>
        {props.children}
      </NextLink>
    );
  } else if (isAnchorLink) {
    return <a href={href} className={baseStyle} {...props} />;
  } else {
    return <a href={href} className={baseStyle} target="_blank" rel="noopener noreferrer" {...props} />;
  }
}

export default Link;
