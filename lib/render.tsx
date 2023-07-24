import { Fragment } from "react";
import { basename as pathBasename } from "path";

import { InlineMath, BlockMath } from "react-katex";
import FormattedDate from "@/components/FormattedDate";
import CodeBlock from "@/components/CodeBlock";
import Bookmark from "@/components/Bookmark";
import Link from "@/components/Link";
import { TableOfContents } from "@/components/TableOfContents";
import { getNotionColorClass, slugify, getPlainText, blockID } from "@/lib/utils";
import type { IconType } from "react-icons";
import { FiFileText, FiDownload, FiExternalLink, FiLink2, FiAtSign, FiPlus, FiMinus, FiGithub, FiCalendar } from "react-icons/fi";
import type { NotionBlock } from "@/lib/types";
import NotionVideo from "@/components/NotionVideo";
import NotionImage from "@/components/NotionImage";
import NotionCallout from "@/components/NotionCallout";

export function renderText(block) {
  const contents = block[block.type];

  switch (block.type) {
    case "mention":
      const mention = contents[contents.type];
      switch (contents.type) {
        case "date":
          return <FormattedDate start={mention.start} end={mention.end} />;
        case "user":
          return <Mention type="user" link={`mailto:${mention.person.email}`} text={mention.name} />;
        case "page":
          return <Mention type="page" link={"/" + mention.id} text={block.plain_text} />;
        case "link_preview":
          const gh_pattern = /https?:\/\/github\.com\/(?<user>[^\/\s]+)\/(?<repo>[^\/\s]+)\/?((issues|pull)\/(?<num>\d+))?/;
          const { user, repo, num } = gh_pattern.exec(mention.url).groups;
          if (repo) {
            return <Mention type="github" link={mention.url} text={`${user}/${repo}${num ? "#" + num : ""}`} />;
          }
        case "template_mention":
          return <Mention type={mention.type.replace("template_mention_", "")} link={null} text={mention[mention.type]} />;

        default:
          return <Unsupported object="mention" type={contents.type} />;
      }

    case "equation":
      return <InlineMath math={contents.expression} />;

    case "text":
      const {
        annotations: { bold, code, italic, strikethrough, underline, color },
      } = block;

      const classes = {
        gray: "text-gray-500 dark:text-gray-400",
        brown: "text-stone-500 dark:text-stone-400",
        orange: "text-orange-500 dark:text-orange-400",
        yellow: "text-amber-500 dark:text-yellow-400",
        green: "text-emerald-500 dark:text-emerald-400",
        blue: "text-blue-500 dark:text-sky-400",
        purple: "text-indigo-500 dark:text-indigo-400",
        pink: "text-pink-500 dark:text-pink-400",
        red: "text-rose-500 dark:text-rose-400",

        gray_background: "bg-gray-300 dark:bg-gray-400",
        brown_background: "bg-stone-300 dark:bg-stone-400",
        orange_background: "bg-orange-300 dark:bg-orange-400",
        yellow_background: "bg-yellow-300 dark:bg-yellow-400",
        green_background: "bg-emerald-300 dark:bg-emerald-400",
        blue_background: "bg-sky-300 dark:bg-sky-400",
        purple_background: "bg-indigo-300 dark:bg-indigo-400",
        pink_background: "bg-pink-300 dark:bg-pink-400",
        red_background: "bg-rose-300 dark:bg-rose-400",
      };

      const highlight = color.includes("background") ? " p-[0.125rem] rounded-sm dark:bg-opacity-40 bg-opacity-50" : "";

      let part: JSX.Element = contents.link ? <Link href={contents.link.url}>{contents.content}</Link> : <>{contents.content}</>;

      if (code) part = <code>{part}</code>;
      if (bold) part = <strong className="font-medium">{part}</strong>;
      if (italic) part = <em>{part}</em>;
      if (strikethrough) part = <del className="text-gray-400 dark:text-gray-600">{part}</del>;
      if (underline) part = <u>{part}</u>;
      if (color.includes("background")) part = <mark className="bg-transparent text-inherit">{part}</mark>;

      return (
        <span className={(classes[color] || "") + highlight} style={{ whiteSpace: "pre-wrap" }}>
          {part}
        </span>
      );

    default:
      return <Unsupported object="text" type={block.type} />;
  }
}

export function renderContent(block: NotionBlock) {
  const contents = block[block.type];
  const children = contents.children;

  switch (block.type) {
    case "table_of_contents":
      if (!children.length) return null;
      return <TableOfContents items={children} className={getNotionColorClass(contents.color)} />;
    case "paragraph":
      if (!contents.rich_text.length) return <br />;
      return (
        <Fragment>
          <p className={"my-4 rounded-sm px-1 py-0.5 " + getNotionColorClass(contents.color)}>
            <NotionText blocks={contents.rich_text} />
          </p>
          {children && (
            <div
              className={
                "ml-1 pl-4 last:!mb-0 last:!pb-0 " +
                "border-l-2 border-gray-200 dark:border-gray-800 " +
                getNotionColorClass(contents.color)
              }
            >
              <NotionContent blocks={children} />
            </div>
          )}
        </Fragment>
      );
    case "heading_1":
    case "heading_2":
    case "heading_3":
      if (!contents.rich_text.length) return null;
      if (contents.children?.length) {
        return (
          <ToggleHeading
            type={block.type}
            id={slugify(getPlainText(contents.rich_text))}
            contents={contents.rich_text}
            className={getNotionColorClass(contents.color)}
          >
            <NotionContent blocks={contents.children} />
          </ToggleHeading>
        );
      } else {
        return (
          <Heading
            type={block.type}
            id={slugify(getPlainText(contents.rich_text))}
            className={getNotionColorClass(contents.color)}
            contents={contents.rich_text}
          />
        );
      }
    case "bulleted_list":
      return <ul>{children && <NotionContent blocks={children} />}</ul>;
    case "numbered_list":
      return <ol>{children && <NotionContent blocks={children} />}</ol>;
    case "bulleted_list_item":
    case "numbered_list_item":
      if (!contents.rich_text.length) return null;
      return (
        <li className={"my-2 rounded-sm px-2 py-1 last:!mb-0 last:!pb-0 " + getNotionColorClass(contents.color)}>
          <NotionText blocks={contents.rich_text} />
          {children && <NotionContent blocks={children} />}
        </li>
      );
    case "to_do":
      if (!contents.rich_text.length) return null;
      return (
        <label htmlFor={block.id} className={"my-2 block rounded-sm py-1 pl-9 -indent-6 " + getNotionColorClass(contents.color)}>
          <input type="checkbox" id={block.id} checked={contents.checked} disabled className="mr-2.5 scale-125 align-middle" />
          <span className={contents.checked ? "text-gray-400 line-through dark:text-gray-600" : ""}>
            <NotionText blocks={contents.rich_text} />
          </span>
          {children && <NotionContent blocks={children} />}
        </label>
      );
    case "toggle":
    case "template":
      if (!contents.rich_text.length) return null;
      return (
        <Accordion
          summary={<NotionText blocks={contents.rich_text} />}
          details={children ? <NotionContent blocks={children} /> : null}
          className={getNotionColorClass(contents.color)}
        />
      );
    case "callout":
      if (!contents.rich_text.length) return null;
      return (
        <NotionCallout icon={contents.icon} color={contents.color} contents={<NotionText blocks={contents.rich_text} />}>
          {children && <NotionContent blocks={children} />}
        </NotionCallout>
      );

    case "code":
      if (!contents.rich_text.length) return null;
      return (
        <CodeBlock lang={contents.language} title={getPlainText(contents.caption)} plain_text={getPlainText(contents.rich_text)}>
          <NotionText blocks={contents.rich_text} />
        </CodeBlock>
      );
    case "image":
      if (!contents[contents.type].url) return null;
      return (
        <NotionImage
          src={contents[contents.type].url}
          alt={getPlainText(contents?.caption)}
          caption={contents.caption.length > 0 ? <NotionText blocks={contents.caption} /> : null}
        />
      );
    case "video":
      if (!contents[contents.type].url) return null;
      return (
        <NotionVideo
          url={contents[contents.type].url}
          caption={contents.caption.length > 0 ? <NotionText blocks={contents.caption} /> : null}
        />
      );
    case "audio":
      if (!contents[contents.type].url) return null;
      return (
        <figure>
          <audio controls src={contents[contents.type].url} preload="auto" className="!h-10 max-h-max !w-full max-w-full" />
          {contents.caption.length > 0 && (
            <figcaption>
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "pdf":
    case "file":
      if (!contents[contents.type].url) return null;
      const fileURL = new URL(contents[contents.type].url);
      const fileName = pathBasename(fileURL.pathname);
      return (
        <LinkCard
          mono
          download={contents.type == "file"}
          url={fileURL.href}
          text={fileName}
          caption={contents.caption}
          icon={contents.type == "file" ? FiDownload : FiExternalLink}
        />
      );
    case "link_preview":
    case "bookmark":
      return (
        // @ts-expect-error[2786]
        <Bookmark url={contents.url} caption={contents.caption?.length > 0 && <NotionText blocks={contents.caption} />} />
      );
    case "equation":
      if (!contents.expression) return null;
      return (
        <div className="my-8">
          <BlockMath math={contents.expression} />
        </div>
      );
    case "link_to_page":
      if (!contents[contents.type]) return null;
      return <LinkCard url={"/" + contents[contents.type]} text={contents.title} icon={FiLink2} />;
    case "child_page":
      if (!block.has_children) return null;
      return <LinkCard url={"/" + block.id} text={contents.title} icon={FiFileText} />;
    case "divider":
      return <hr />;
    case "column_list":
      if (!contents.children.length) return null;
      return (
        <div className="grid grid-flow-row md:grid-flow-col md:gap-8">
          {contents.children.map(({ column: { children: columnChildren }, id }) => (
            <div className="w-full" key={id}>
              <NotionContent blocks={columnChildren} />
            </div>
          ))}
        </div>
      );
    case "synced_block":
      if (!children.length) return null;
      return <>{children && <NotionContent blocks={children} />}</>;
    case "quote":
      if (!contents.rich_text.length) return null;
      return (
        <blockquote className={"py-1 " + getNotionColorClass(contents.color)}>
          <NotionText blocks={contents.rich_text} />
        </blockquote>
      );
    case "table":
      if (!contents.table_width && !contents.children.length) return null;

      return (
        <table className="w-full table-auto">
          {contents.has_column_header && (
            <thead>
              <tr>
                {children[0].table_row.cells.map((cell, i) => (
                  <td key={i} className="px-4 py-2">
                    <NotionText blocks={cell} />
                  </td>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {children.slice(contents.has_column_header ? 1 : 0).map(({ table_row }, i) => (
              <tr key={i}>
                {table_row.cells.map((cell, j) => (
                  <td key={j} className="px-4 py-2">
                    <NotionText blocks={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    default:
      // console.debug(block.type, block[block.type]);
      return <Unsupported object={block.object} type={block.type} />;
  }
}

export function NotionContent({ blocks }: { blocks: NotionBlock[] }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block) => (
        <Fragment key={block.id}>{renderContent(block)}</Fragment>
      ))}
    </>
  );
}

export function NotionText({ blocks }) {
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((block) => (
        <Fragment key={blockID.next().value || ""}>{renderText(block)}</Fragment>
      ))}
    </>
  );
}

function Mention({ type, link, text }: { type: "user" | "page" | "github" | "date"; link: string; text: string }) {
  const icons = {
    user: FiAtSign,
    page: FiLink2,
    github: FiGithub,
    date: FiCalendar,
  };
  const MentionIcon = icons[type];
  return (
    <Link href={link} className="whitespace-nowrap rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-900">
      <MentionIcon size={16} className="mb-0.5 mr-1 inline-block text-gray-500 dark:text-gray-500" />
      <span>{text}</span>
    </Link>
  );
}

function Unsupported({ object, type }) {
  if (!process.env.NODE_ENV.toUpperCase().startsWith("PROD")) console.warn(`unsupported ${object}: ${type}`);
  return (
    <figure className="my-6 flex flex-nowrap space-x-2.5 overflow-auto whitespace-nowrap rounded border border-rose-200 bg-rose-600 bg-opacity-5 px-3 py-2 dark:border-rose-950 print:hidden">
      <span>❌</span>
      <span>Unsupported {object}</span>
      <span className="font-mono">[{type}]</span>
    </figure>
  );
}

function Heading({
  type,
  id,
  contents,
  className = "",
  ...props
}: {
  type: "heading_1" | "heading_2" | "heading_3";
  id: string;
  contents: any;
  [key: string]: any;
}) {
  const tags: { [key: string]: keyof JSX.IntrinsicElements } = {
    heading_1: "h2",
    heading_2: "h3",
    heading_3: "h4",
  };

  const HeadingX = tags[type];

  return (
    <HeadingX id={id} className={"rounded-sm p-1 " + className}>
      <a
        href={"#" + id}
        className="hidden rounded px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 sm:inline"
        aria-hidden="true"
        tabIndex={-1}
      >
        <span className="icon icon-link"></span>
      </a>
      <span {...props}>
        <NotionText blocks={contents} />
      </span>
    </HeadingX>
  );
}

function ToggleHeading({
  type,
  id,
  contents,
  className,
  children,
}: {
  type: "heading_1" | "heading_2" | "heading_3";
  id: string;
  contents: any;
  className?: string;
  children?: React.ReactChild;
}) {
  return (
    <details className="group">
      <summary className={"cursor-pointer list-none rounded-sm " + className}>
        <div className="my-2 flex items-center justify-between py-1">
          <Heading type={type} id={id} contents={contents} className="m-0" />
          <span className="mx-2 h-min w-min rounded p-1 hover:bg-gray-100 hover:dark:bg-gray-800">
            <FiPlus className="block h-6 w-6 group-open:hidden" />
            <FiMinus className="hidden h-6 w-6 group-open:block" />
          </span>
        </div>
      </summary>
      <div className="border-l-2 border-gray-200 pl-4 dark:border-gray-800">{children}</div>
    </details>
  );
}

interface LinkCardProps {
  url: string;
  icon: IconType;
  text: string;
  caption?: any;
  download?: boolean;
  mono?: boolean;
}

function LinkCard({ url, icon: CardIcon, text, caption, download, mono }: LinkCardProps) {
  return (
    <figure className="my-6">
      <Link
        className="flex items-center space-x-3 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 hover:bg-gray-100 hover:no-underline dark:border-gray-900 dark:bg-gray-950 dark:text-gray-400 dark:hover:border-gray-800 dark:hover:bg-gray-900"
        href={url}
        download={download}
      >
        <CardIcon className="h-6 w-6" />
        <span className={"line-clamp-1 w-full break-all" + (mono ? " font-mono" : "")}>{text}</span>
      </Link>
      {caption?.length > 0 && (
        <figcaption>
          <NotionText blocks={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function Accordion({
  summary,
  details,
  className = "",
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  summary: React.ReactNode | string;
  details: React.ReactNode;
}) {
  return (
    <details
      className={"group my-6 rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-900 dark:bg-gray-950 " + className}
    >
      <summary className="!m-0 flex cursor-pointer list-none space-x-2 font-medium">
        <span className={details ? "" : "text-gray-400 dark:text-gray-600"}>
          <FiPlus className="mt-0.5 block h-6 w-6 group-open:hidden" />
          <FiMinus className="mt-0.5 hidden h-6 w-6 group-open:block" />
        </span>
        <p className="m-0 line-clamp-1 w-full group-open:line-clamp-none">{summary}</p>
      </summary>
      <hr className="mb-4 mt-2" />
      {details || <p className="text-gray-400 dark:text-gray-600">This block is empty</p>}
    </details>
  );
}
