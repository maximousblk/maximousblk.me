import { Fragment } from "react";
import { format, parseISO } from "date-fns";
import { basename as pathBasename } from "path";

import Image from "next/image";
import ReactPlayer from "react-player";
import TeX from "@matejmazur/react-katex";
import CodeBlock from "@/components/CodeBlock";
import Bookmark from "@/components/Bookmark";
import Link from "@/components/Link";
import { Twemoji } from "@/components/Twemoji";
import { TableOfContents, slugify } from "@/components/TableOfContents";
import { FileText, Download, ExternalLink, Link2, AtSign } from "react-feather";
import type { Icon } from "react-feather";
import type { NotionBlock } from "@/lib/notion";

export function renderText(block) {
  const contents = block[block.type];

  switch (block.type) {
    case "mention":
      switch (contents.type) {
        case "date":
          const date = contents.date;
          const start = parseISO(date.start);
          const end = parseISO(date.end);
          const hasTime = (d: Date) => d.getHours() !== 0;
          const withTime = (d: Date) => format(d, "PPpp");
          const withoutTime = (d: Date) => format(d, "PP");

          return (
            <span>
              {hasTime(start) ? withTime(start) : withoutTime(start)}
              {date.end ? ` - ${hasTime(end) ? withTime(end) : withoutTime(end)}` : ""}
            </span>
          );
        case "user":
          return <Mention type="user" link={`mailto:${contents.user.person.email}`} text={contents.user.name} />;
        case "page":
          return <Mention type="page" link={"/p/" + contents.page.id} text={block.plain_text} />;

        default:
          return <Unsupported type={contents.type} />;
      }

    case "equation":
      return <TeX math={contents.expression} />;

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

        gray_background: "bg-gray-400",
        brown_background: "bg-stone-400",
        orange_background: "bg-orange-400",
        yellow_background: "bg-yellow-400",
        green_background: "bg-emerald-400",
        blue_background: "bg-sky-400",
        purple_background: "bg-indigo-400",
        pink_background: "bg-pink-400",
        red_background: "bg-rose-400",
      };

      const highlight = color.includes("background") ? " p-0.5 rounded-sm text-gray-900 dark:bg-opacity-90 bg-opacity-40" : "";

      let part: JSX.Element = contents.link ? <Link href={contents.link.url}>{contents.content}</Link> : <>{contents.content}</>;

      if (code) part = <code>{part}</code>;
      if (bold) part = <strong>{part}</strong>;
      if (italic) part = <em>{part}</em>;
      if (strikethrough) part = <del>{part}</del>;
      if (underline) part = <u>{part}</u>;

      return (
        <span className={classes[color] + highlight} style={{ whiteSpace: "pre-wrap" }}>
          {part}
        </span>
      );

    default:
      return <Unsupported type={block.type} />;
  }
}

export function renderContent(block: NotionBlock) {
  const contents = block[block.type];
  const children = contents.children;

  switch (block.type) {
    case "table_of_contents":
      return (
        <>
          <p id="_toc" className="font-mono text-sm">
            Table of Contents
          </p>
          <TableOfContents items={children} />
        </>
      );
    case "paragraph":
      if (!contents.text.length) return null;
      return (
        <>
          <p>
            <NotionText blocks={contents.text} />
          </p>
          {children && (
            <div className="ml-5">
              <NotionContent blocks={children} />
            </div>
          )}
        </>
      );
    case "heading_1":
    case "heading_2":
    case "heading_3":
      if (!contents.text.length) return null;
      return <Heading type={block.type} id={slugify(contents.text.map(({ plain_text }) => plain_text))} contents={contents.text} />;
    case "bulleted_list":
      return <ul>{children && <NotionContent blocks={children} />}</ul>;
    case "numbered_list":
      return <ol>{children && <NotionContent blocks={children} />}</ol>;
    case "bulleted_list_item":
    case "numbered_list_item":
      if (!contents.text.length) return null;
      return (
        <li>
          <NotionText blocks={contents.text} />
          {children && <NotionContent blocks={children} />}
        </li>
      );
    case "to_do":
      if (!contents.text.length) return null;
      return (
        <label htmlFor={block.id}>
          <input type="checkbox" id={block.id} checked={contents.checked} disabled />
          <span className={contents.checked ? "text-gray-400 dark:text-gray-600" : ""}>
            <NotionText blocks={contents.text} />
            {children && <NotionContent blocks={children} />}
          </span>
        </label>
      );
    case "toggle":
      if (!contents.text.length) return null;
      return (
        <details>
          <summary className="p-2">
            <NotionText blocks={contents.text} />
          </summary>
          <div>{children && <NotionContent blocks={children} />}</div>
        </details>
      );
    case "callout":
      if (!contents.text.length) return null;
      return (
        <aside className="flex space-x-3 p-3 mb-6 rounded border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="h-6 w-6 flex-shrink-0 rounded overflow-hidden select-none" aria-hidden="true">
            {contents.icon.type == "emoji" ? (
              <Twemoji emoji={contents.icon.emoji} size={24} />
            ) : (
              <Image alt="callout icon" src={contents.icon[contents.icon.type].url} height={24} width={24} />
            )}
          </div>

          <div className="w-full space-y-4">
            <NotionText blocks={contents.text} />
            {children && <NotionContent blocks={children} />}
          </div>
        </aside>
      );
    case "code":
      if (!contents.text.length) return null;
      // TODO: add captions/titles when they get added to the api
      return (
        <CodeBlock>
          <NotionText blocks={contents.text} />
        </CodeBlock>
      );
    case "image":
      if (!contents[contents.type].url) return null;
      return (
        <figure>
          <div className="flex rounded overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              height={contents.size.height}
              width={contents.size.width}
              src={contents[contents.type].url}
              alt={contents?.caption.map(({ plain_text }) => plain_text).join("") ?? ""}
            />
          </div>
          {contents.caption.length > 0 && (
            <figcaption>
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "video":
      if (!contents[contents.type].url) return null;
      return (
        <figure>
          <div className="rounded overflow-hidden border border-gray-200 dark:border-gray-700">
            <ReactPlayer light controls url={contents[contents.type].url} className="max-w-full !w-full max-h-max !h-auto aspect-video" />
          </div>
          {contents.caption.length > 0 && (
            <figcaption>
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "audio":
      if (!contents[contents.type].url) return null;
      return (
        <figure>
          <audio controls src={contents[contents.type].url} preload="auto" className="max-w-full !w-full max-h-max !h-10" />
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
          icon={contents.type == "file" ? Download : ExternalLink}
        />
      );
    case "bookmark":
      return (
        <Bookmark
          title={contents.meta.title}
          description={contents.meta.description}
          url={contents.meta.url}
          image={contents.meta.image}
          caption={contents.caption.length > 0 && <NotionText blocks={contents.caption} />}
        />
      );
    case "equation":
      if (!contents.expression) return null;
      return <TeX math={contents.expression} block className="my-8" />;
    case "link_to_page":
      if (!contents[contents.type]) return null;
      return <LinkCard url={"/p/" + contents[contents.type]} text={contents.title} icon={Link2} />;
    case "child_page":
      if (!block.has_children) return null;
      return <LinkCard url={"/p/" + block.id} text={contents.title} icon={FileText} />;
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
      if (!contents.text.length) return null;
      return (
        <blockquote>
          <NotionText blocks={contents.text} />
        </blockquote>
      );
    default:
      return <Unsupported type={block.type} />;
  }
}

export function NotionContent({ blocks }: { blocks: NotionBlock[] }) {
  if (!blocks.length) return null;
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
        <Fragment key={Math.random()}>{renderText(block)}</Fragment>
      ))}
    </>
  );
}

function Mention({ type, link, text }: { type: "user" | "page"; link: string; text: string }) {
  const icons = {
    user: AtSign,
    page: Link2,
  };
  const Icon = icons[type];
  return (
    <Link href={link} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
      <Icon size={16} className="inline-block mr-1 mb-0.5 text-gray-500 dark:text-gray-500" />
      <span>{text}</span>
    </Link>
  );
}

function Unsupported({ type }) {
  console.warn("unsupported content:", type);
  return (
    <figure className="my-4 p-2 flex flex-nowrap space-x-2.5 overflow-auto whitespace-nowrap rounded border bg-opacity-5 bg-rose-600 border-rose-200 dark:border-rose-900">
      <span>❌</span>
      <span>Unsupported content</span>
      <span className="font-mono">[{type}]</span>
    </figure>
  );
}

function Heading({ type, id, contents }: { type: "heading_1" | "heading_2" | "heading_3"; id: string; contents: any }) {
  const tags: { [key: string]: keyof JSX.IntrinsicElements } = {
    heading_1: "h2",
    heading_2: "h3",
    heading_3: "h4",
  };

  const HeadingX = tags[type];

  return (
    <HeadingX id={id}>
      <a
        href={"#" + id}
        className="px-1 py-0.5 rounded hidden sm:inline hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-hidden="true"
        tabIndex={-1}
      >
        <span className="icon icon-link"></span>
      </a>
      <NotionText blocks={contents} />
    </HeadingX>
  );
}

interface LinkCardProps {
  url: string;
  icon: Icon;
  text: string;
  caption?: any;
  download?: boolean;
  mono?: boolean;
}

function LinkCard({ url, icon: CardIcon, text, caption, download, mono }: LinkCardProps) {
  return (
    <figure className="my-4">
      <Link
        className="hover:no-underline flex items-center space-x-2 py-2 px-3 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-400"
        href={url}
        download={download}
      >
        <CardIcon />
        <span className={mono ? "font-mono" : null}>{text}</span>
      </Link>
      {caption?.length > 0 && (
        <figcaption>
          <NotionText blocks={caption} />
        </figcaption>
      )}
    </figure>
  );
}
