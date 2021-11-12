import { Fragment } from "react";
import { format, parseISO } from "date-fns";
import path from "path";

import { File, FileText, Download, ExternalLink } from "react-feather";
import ReactPlayer from "react-player";
import TeX from "@matejmazur/react-katex";
import { CustomLink } from "@/components/MDXComponents";
import CodeBlock from "@/components/CodeBlock";
import { TableOfContents, slugify } from "@/components/TableOfContents";
import type { NotionBlock } from "@/lib/notion";

export function NotionText({ blocks }) {
  return blocks.map((block) => {
    const textBlock = block[block.type];

    switch (block.type) {
      case "mention":
        switch (textBlock.type) {
          case "date":
            const date = textBlock.date;
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
            return <span className="underline">{block.plain_text}</span>;
          case "page":
            const page = textBlock.page;
            return <CustomLink href={"/p/" + page.id}>{block.plain_text}</CustomLink>;
          default:
            console.log("unsupported mention:", textBlock);
            return <p>{`❌ Unsupported mention (${textBlock})`}</p>;
        }

      case "equation":
        return <TeX math={textBlock.expression} />;

      case "text":
        const {
          annotations: { bold, code, italic, strikethrough, underline },
        } = block;

        let part: JSX.Element = textBlock.link ? (
          <CustomLink href={textBlock.link.url}>{textBlock.content}</CustomLink>
        ) : (
          <>{textBlock.content}</>
        );

        if (code) part = <code>{part}</code>;
        if (bold) part = <strong>{part}</strong>;
        if (italic) part = <em>{part}</em>;
        if (strikethrough) part = <del>{part}</del>;
        if (underline) part = <u>{part}</u>;

        return <span style={{ whiteSpace: "pre-wrap" }}>{part}</span>;

      default:
        console.log("unsupported text:", block.type);
        return <p>{`❌ Unsupported text (${block.type})`}</p>;
    }
  });
}

export function renderBlock(block: NotionBlock) {
  const contents = block[block.type];
  const children = contents.children;

  switch (block.type) {
    case "table_of_contents":
      return (
        <>
          <h6 id="_toc">Table of Contents</h6>
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
      return (
        <h1 id={slugify(contents.text.map(({ plain_text }) => plain_text))}>
          <a
            href={"#" + slugify(contents.text.map(({ plain_text }) => plain_text))}
            className="px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="icon icon-link"></span>
          </a>
          <NotionText blocks={contents.text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2 id={slugify(contents.text.map(({ plain_text }) => plain_text))}>
          <a
            href={"#" + slugify(contents.text.map(({ plain_text }) => plain_text))}
            className="px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="icon icon-link"></span>
          </a>
          <NotionText blocks={contents.text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 id={slugify(contents.text.map(({ plain_text }) => plain_text))}>
          <a
            href={"#" + slugify(contents.text.map(({ plain_text }) => plain_text))}
            className="px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="icon icon-link"></span>
          </a>
          <NotionText blocks={contents.text} />
        </h3>
      );
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
          <NotionText blocks={contents.text} />
          {children && <NotionContent blocks={children} />}
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
    case "code":
      // TODO: add captions/titles when they get added to the api
      return (
        <CodeBlock>
          <NotionText blocks={contents.text} />
        </CodeBlock>
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
          <ReactPlayer controls url={contents[contents.type].url} className="max-w-full !w-full max-h-max !h-10" />
          {contents.caption && (
            <figcaption>
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "equation":
      return <TeX math={contents.expression} block />;
    case "child_page":
      return (
        <CustomLink className="hover:no-underline" href={"/p/" + block.id}>
          <p className="flex py-2 px-3 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-400">
            {block.has_children ? <FileText /> : <File />}
            <span className="pl-2">{contents.title}</span>
          </p>
        </CustomLink>
      );
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
    case "quote":
      return (
        <blockquote>
          <NotionText blocks={contents.text} />
        </blockquote>
      );
    case "image":
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="border border-gray-200 dark:border-gray-700"
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
    case "file":
      const fileURL = new URL(contents[contents.type].url);
      const fileName = path.basename(fileURL.pathname);
      return (
        <CustomLink className="hover:no-underline" href={fileURL.href}>
          <p className="flex py-2 px-3 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-400">
            {contents.type == "file" ? <Download /> : <ExternalLink />}
            <span className="pl-2 font-mono">{fileName}</span>
          </p>
        </CustomLink>
      );
    default:
      if (block.type !== "unsupported") console.log("unsupported block:", block.type);
      return <p>{`❌ Unsupported block (${block.type === "unsupported" ? "unknown" : block.type})`}</p>;
  }
}

export function NotionContent({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <>
      {blocks.map((block) => (
        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
      ))}
    </>
  );
}
