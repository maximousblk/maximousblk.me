import { Fragment } from "react";
import { format, parseISO } from "date-fns";
import { basename as pathBasename } from "path";
import type { Icon } from "react-feather";

import { File, FileText, Download, ExternalLink, Link2, AtSign } from "react-feather";
import Image from "next/image";
import ReactPlayer from "react-player";
import TeX from "@matejmazur/react-katex";
import { CustomLink } from "@/components/MDXComponents";
import { Twemoji } from "@/components/Twemoji";
import CodeBlock from "@/components/CodeBlock";
import { TableOfContents, slugify } from "@/components/TableOfContents";
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
          console.log("unsupported mention:", contents.type);
          return <Unsupported block={contents} />;
      }

    case "equation":
      return <TeX math={contents.expression} />;

    case "text":
      const {
        annotations: { bold, code, italic, strikethrough, underline, color },
      } = block;

      const classes = {
        gray: "text-gray-400",
        brown: "text-brown-400",
        orange: "text-orange-400",
        yellow: "text-yellow-400",
        green: "text-emerald-400",
        blue: "text-sky-400",
        purple: "text-indigo-400",
        pink: "text-pink-400",
        red: "text-rose-400",

        gray_background: "bg-gray-400",
        brown_background: "bg-brown-400",
        orange_background: "bg-orange-400",
        yellow_background: "bg-yellow-400",
        green_background: "bg-emerald-400",
        blue_background: "bg-sky-400",
        purple_background: "bg-indigo-400",
        pink_background: "bg-pink-400",
        red_background: "bg-rose-400",
      };

      const highlight = (classes[color] || "") + (color.includes("background") ? " p-0.5 rounded-sm !bg-opacity-30" : "");

      let part: JSX.Element = contents.link ? (
        <CustomLink href={contents.link.url}>{contents.content}</CustomLink>
      ) : (
        <>{contents.content}</>
      );

      if (code) part = <code>{part}</code>;
      if (bold) part = <strong>{part}</strong>;
      if (italic) part = <em>{part}</em>;
      if (strikethrough) part = <del>{part}</del>;
      if (underline) part = <u>{part}</u>;

      return (
        <span className={highlight} style={{ whiteSpace: "pre-wrap" }}>
          {part}
        </span>
      );

    default:
      console.log("unsupported text:", block.type);
      return <Unsupported block={block} />;
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
      return (
        <>
          <p>
            <NotionText blocks={contents.text} />
          </p>
          <div className="ml-5">{children && <NotionContent blocks={children} />}</div>
        </>
      );
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <Heading type={block.type} id={slugify(contents.text.map(({ plain_text }) => plain_text))} contents={contents.text} />;
    case "bulleted_list":
      return <ul>{children && <NotionContent blocks={children} />}</ul>;
    case "numbered_list":
      return <ol>{children && <NotionContent blocks={children} />}</ol>;
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
          <NotionText blocks={contents.text} />
          {children && <NotionContent blocks={children} />}
        </li>
      );
    case "to_do":
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
      return (
        <details>
          <summary className="p-2">
            <NotionText blocks={contents.text} />
          </summary>
          <div>{children && <NotionContent blocks={children} />}</div>
        </details>
      );
    case "callout":
      return (
        <aside className="flex space-x-3 p-3 mb-6 rounded border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="mt-1 h-5 w-5 flex-shrink-0 !rounded-sm select-none" aria-hidden="true">
            {contents.icon.type == "emoji" ? (
              <Twemoji emoji={contents.icon.emoji} size={20} />
            ) : (
              <Image alt="callout icon" src={contents.icon[contents.icon.type].url} height={20} width={20} />
            )}
          </div>

          <div className="w-full space-y-4">
            <NotionText blocks={contents.text} />
            {children && <NotionContent blocks={children} />}
          </div>
        </aside>
      );
    case "code":
      // TODO: add captions/titles when they get added to the api
      return (
        <CodeBlock>
          <NotionText blocks={contents.text} />
        </CodeBlock>
      );
    case "image":
      return (
        <figure>
          <Image
            height={contents.size.height}
            width={contents.size.width}
            src={contents[contents.type].url}
            alt={contents?.caption.map(({ plain_text }) => plain_text).join("") ?? ""}
          />
          {contents.caption && (
            <figcaption>
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "video":
      return (
        <figure>
          <div className="!rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <ReactPlayer light controls url={contents[contents.type].url} className="max-w-full !w-full max-h-max !h-auto aspect-video" />
          </div>
          {contents.caption && (
            <figcaption>
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "audio":
      return (
        <figure>
          <audio controls src={contents[contents.type].url} preload="auto" className="max-w-full !w-full max-h-max !h-10" />
          {contents.caption && (
            <figcaption>
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "equation":
      return <TeX math={contents.expression} block className="my-8" />;
    case "link_to_page":
      return <LinkCard url={"/p/" + contents[contents.type]} text={contents.title} icon={Link2} />;
    case "child_page":
      return <LinkCard url={"/p/" + block.id} text={contents.title} icon={block.has_children ? FileText : File} />;
    case "divider":
      return <hr />;
    case "column_list":
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
      return <>{children && <NotionContent blocks={children} />}</>;
    case "quote":
      return (
        <blockquote>
          <NotionText blocks={contents.text} />
        </blockquote>
      );
    case "file":
      const fileURL = new URL(contents[contents.type].url);
      const fileName = pathBasename(fileURL.pathname);
      return <LinkCard mono url={fileURL.href} text={fileName} icon={contents.type == "file" ? Download : ExternalLink} />;
    default:
      if (block.type !== "unsupported") console.log("unsupported block:", block.type);
      return <Unsupported block={block} />;
  }
}

export function NotionContent({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <>
      {blocks.map((block) => (
        <Fragment key={block.id}>{renderContent(block)}</Fragment>
      ))}
    </>
  );
}

export function NotionText({ blocks }) {
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
    <CustomLink href={link} className="px-1.5 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
      <Icon size={16} className="inline-block mr-1 mb-0.5 text-gray-500 dark:text-gray-500" />
      <span>{text}</span>
    </CustomLink>
  );
}

function Unsupported({ block }) {
  return (
    <p className="p-2 flex flex-nowrap space-x-2 overflow-auto whitespace-nowrap rounded border bg-opacity-5 bg-rose-600 border-rose-200 dark:border-rose-900">
      <span>❌</span>
      <span>Unsupported content</span>
      <span className="font-mono">[{block.type}]</span>
    </p>
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

function LinkCard({ url, icon: CardIcon, text, mono }: { url: string; icon: Icon; text: string; mono?: boolean }) {
  return (
    <CustomLink className="hover:no-underline" href={url}>
      <p className="flex items-center space-x-2 py-2 px-3 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-400">
        <CardIcon />
        <span className={mono ? "font-mono" : null}>{text}</span>
      </p>
    </CustomLink>
  );
}
