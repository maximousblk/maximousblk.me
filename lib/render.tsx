import { Fragment } from "react";
import { parseISO } from "date-fns";
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
            return <a>{block.plain_text}</a>;
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
        <p>
          <NotionText blocks={contents.text} />
        </p>
      );
    case "heading_1":
      return (
        <h2 id={slugify(contents.text.map(({ plain_text }) => plain_text))}>
          <a
            href={"#" + slugify(contents.text.map(({ plain_text }) => plain_text))}
            className="px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-coolGray-800 rounded"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="icon icon-link"></span>
          </a>
          <NotionText blocks={contents.text} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 id={slugify(contents.text.map(({ plain_text }) => plain_text))}>
          <a
            href={"#" + slugify(contents.text.map(({ plain_text }) => plain_text))}
            className="px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-coolGray-800 rounded"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="icon icon-link"></span>
          </a>
          <NotionText blocks={contents.text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 id={slugify(contents.text.map(({ plain_text }) => plain_text))}>
          <a
            href={"#" + slugify(contents.text.map(({ plain_text }) => plain_text))}
            className="px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-coolGray-800 rounded"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="icon icon-link"></span>
          </a>
          <NotionText blocks={contents.text} />
        </h4>
      );
    case "bulleted_list":
      return <ul>{children && children.map((child) => renderBlock(child))}</ul>;
    case "numbered_list":
      return <ol>{children && children.map((child) => renderBlock(child))}</ol>;
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
          <NotionText blocks={contents.text} />
          {children && children.map((child) => renderBlock(child))}
        </li>
      );
    case "to_do":
      return (
        <label htmlFor={block.id}>
          <input type="checkbox" id={block.id} checked={contents.checked} disabled />
          <NotionText blocks={contents.text} />
          {children && children.map((child) => renderBlock(child))}
        </label>
      );
    case "toggle":
      return (
        <details>
          <summary className="p-2">
            <NotionText blocks={contents.text} />
          </summary>
          <div>
            {children?.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </div>
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
          <div className="flex justify-center">
            <ReactPlayer light controls url={contents[contents.type].url} width={800} height={450} />
          </div>
          {contents.caption && (
            <figcaption className="flex justify-center">
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "audio":
      return (
        <figure>
          <div className="flex justify-center">
            <ReactPlayer controls url={contents[contents.type].url} width="100%" height="5em" />
          </div>
          {contents.caption && (
            <figcaption className="flex justify-center">
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
          <p className="flex py-2 px-3 rounded border border-gray-800 bg-gray-900 hover:bg-gray-800 text-gray-400">
            {block.has_children ? <FileText /> : <File />}
            <span className="pl-2">{contents.title}</span>
          </p>
        </CustomLink>
      );
    case "divider":
      return <hr />;
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
          <img src={contents[contents.type].url} alt={contents?.caption.map(({ plain_text }) => plain_text).join("") ?? ""} />
          {contents.caption && (
            <figcaption>
              <NotionText blocks={contents.caption} />
            </figcaption>
          )}
        </figure>
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
