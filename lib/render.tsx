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
import { TableOfContents } from "@/components/TableOfContents";
import { slugify } from "@/lib/utils";
import { type Icon, FileText, Download, ExternalLink, Link2, AtSign, Play, Plus, Minus, GitHub } from "react-feather";
import type { NotionBlock } from "@/lib/notion";

export function renderText(block) {
  const contents = block[block.type];

  switch (block.type) {
    case "mention":
      const mention = contents[contents.type];
      switch (contents.type) {
        case "date":
          const date = mention;
          const start = parseISO(date.start);
          const end = parseISO(date.end);
          const hasTime = (d: Date) => d.getHours() !== 0;
          const withTime = (d: Date) => format(d, "PPpp");
          const withoutTime = (d: Date) => format(d, "PP");

          return (
            <time dateTime={start.toISOString()}>
              {hasTime(start) ? withTime(start) : withoutTime(start)}
              {date.end ? ` - ${hasTime(end) ? withTime(end) : withoutTime(end)}` : ""}
            </time>
          );
        case "user":
          return <Mention type="user" link={`mailto:${mention.person.email}`} text={mention.name} />;
        case "page":
          return <Mention type="page" link={"/p/" + mention.id} text={block.plain_text} />;
        case "link_preview":
          const GHreg = /https?:\/\/github\.com\/(?<user>[^\/\s]+)\/(?<repo>[^\/\s]+)\/?((issues|pull)\/(?<num>\d+))?/;
          const { user, repo, num } = GHreg.exec(mention.url).groups;
          if (repo) {
            return <Mention type="github" link={mention.url} text={`${user}/${repo}${num ? "#" + num : ""}`} />;
          }

        default:
          return <Unsupported object="mention" type={contents.type} />;
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

      const highlight = color.includes("background") ? " p-[0.125rem] rounded-sm text-gray-900 dark:bg-opacity-90 bg-opacity-50" : "";

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
      return <TableOfContents items={children} />;
    case "paragraph":
      if (!contents.text.length) return null;
      return (
        <Fragment>
          <p>
            <NotionText blocks={contents.text} />
          </p>
          {children && (
            <div className="ml-1 pl-4 border-l-2 border-gray-200 dark:border-gray-800">
              <NotionContent blocks={children} />
            </div>
          )}
        </Fragment>
      );
    case "heading_1":
    case "heading_2":
    case "heading_3":
      if (!contents.text?.length) return null;
      if (contents.children?.length) {
        return (
          <ToggleHeading type={block.type} id={slugify(contents.text.map(({ plain_text }) => plain_text))} contents={contents.text}>
            <NotionContent blocks={contents.children} />
          </ToggleHeading>
        );
      } else {
        return <Heading type={block.type} id={slugify(contents.text.map(({ plain_text }) => plain_text))} contents={contents.text} />;
      }

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
        <label htmlFor={block.id} className="my-2 pl-6 block -indent-5">
          <input type="checkbox" id={block.id} checked={contents.checked} disabled className="mr-2" />
          <span className={contents.checked ? "line-through text-gray-400 dark:text-gray-600" : ""}>
            <NotionText blocks={contents.text} />
          </span>
          {children && <NotionContent blocks={children} />}
        </label>
      );
    case "toggle":
      if (!contents.text.length) return null;
      return <Accordion summary={<NotionText blocks={contents.text} />} details={children ? <NotionContent blocks={children} /> : null} />;
    case "callout":
      if (!contents.text.length) return null;
      const icon = contents.icon;
      return (
        <div className="flex space-x-3 px-3 py-2 my-6 rounded border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="h-6 w-6 mt-0.5 rounded overflow-hidden select-none" aria-hidden="true">
            {contents.icon.type == "emoji" ? (
              <Twemoji emoji={contents.icon.emoji} size={24} />
            ) : (
              <Image
                alt=""
                src={icon.type == "file" ? icon.file.url : "https://images.weserv.nl/?url=" + icon[icon.type].url}
                height={24}
                width={24}
              />
            )}
          </div>

          <div className="w-full space-y-4">
            <NotionText blocks={contents.text} />
            {children && <NotionContent blocks={children} />}
          </div>
        </div>
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
          <div className="flex mx-auto w-fit rounded-md overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
            <Image
              quality={90}
              height={contents.size.height}
              width={contents.size.width}
              src={contents.type == "file" ? contents.file.url : "https://images.weserv.nl/?url=" + contents[contents.type].url}
              alt={contents?.caption.map(({ plain_text }) => plain_text).join("")}
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
          <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
            <ReactPlayer
              light
              controls
              url={contents[contents.type].url}
              playIcon={<Play size="64" />}
              className="max-w-full !w-full max-h-max !h-auto aspect-video"
            />
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
    case "link_preview":
    case "bookmark":
      return (
        <Bookmark
          title={contents.meta.title}
          description={contents.meta.description}
          url={contents.meta.url}
          image={contents.meta.image}
          caption={contents.caption?.length > 0 && <NotionText blocks={contents.caption} />}
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
        <Fragment key={Math.random()}>{renderText(block)}</Fragment>
      ))}
    </>
  );
}

function Mention({ type, link, text }: { type: "user" | "page" | "github"; link: string; text: string }) {
  const icons = {
    user: AtSign,
    page: Link2,
    github: GitHub,
  };
  const Icon = icons[type];
  return (
    <Link href={link} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
      <Icon size={16} className="inline-block mr-1 mb-0.5 text-gray-500 dark:text-gray-500" />
      <span>{text}</span>
    </Link>
  );
}

function Unsupported({ object, type }) {
  console.warn(`unsupported ${object}: ${type}`);
  return (
    <figure className="my-6 px-3 py-2 print:hidden flex flex-nowrap space-x-2.5 overflow-auto whitespace-nowrap rounded border bg-opacity-5 bg-rose-600 border-rose-200 dark:border-rose-900">
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
    <HeadingX id={id}>
      <a
        href={"#" + id}
        className="px-1 py-0.5 rounded hidden sm:inline hover:bg-gray-100 dark:hover:bg-gray-800"
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
  children,
}: {
  type: "heading_1" | "heading_2" | "heading_3";
  id: string;
  contents: any;
  children?: React.ReactChild;
}) {
  return (
    <details>
      <summary className="list-none">
        <Heading type={type} id={id} contents={contents} className="hover:cursor-pointer hover:underline" />
      </summary>
      <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-800">{children}</div>
    </details>
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
    <figure className="my-6">
      <Link
        className="hover:no-underline flex items-center space-x-3 px-3 py-2 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-400"
        href={url}
        download={download}
      >
        <CardIcon className="h-6 w-6" />
        <span className={"w-full line-clamp-1 break-all" + (mono ? " font-mono" : "")}>{text}</span>
      </Link>
      {caption?.length > 0 && (
        <figcaption>
          <NotionText blocks={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function Accordion({ summary, details }: { summary: React.ReactNode | string; details: React.ReactNode }) {
  return (
    <details className="group my-6 px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <summary className="!m-0 flex list-none space-x-2 cursor-pointer font-medium">
        <span>
          <Plus className="block group-open:hidden mt-0.5 h-6 w-6" />
          <Minus className="hidden group-open:block mt-0.5 h-6 w-6" />
        </span>
        <p className="m-0 w-full line-clamp-1 group-open:line-clamp-none">{summary}</p>
      </summary>
      <hr className="mt-2 mb-4" />
      {details || <p className="text-gray-400 dark:text-gray-600">This block is empty</p>}
    </details>
  );
}
