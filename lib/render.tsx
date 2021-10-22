import { Fragment } from "react";
import TeX from "@matejmazur/react-katex";
import { CustomLink } from "@/components/MDXComponents";
import { CodeBlock } from "@/components/CodeBlock";
import type { NotionBlock } from "@/lib/notion";

export function NotionText({ blocks }) {
  return blocks.map((block) => {
    const textBlock = block[block.type];

    switch (block.type) {
      case "mention":
        switch (textBlock.type) {
          case "date":
            const date = textBlock.date;
            return (
              <span>
                {date.start}
                {date.end ? " - " : ""}
                {date.end}
              </span>
            );
          case "user":
            return <span className="px-1 py-0.5 bg-gray-100 dark:bg-coolGray-800 rounded">{block.plain_text}</span>;
          case "page":
            const page = textBlock.page;
            return <CustomLink href={`/${page.id}`}>{block.plain_text}</CustomLink>;
          default:
            console.log("unsupported mention:", textBlock);
            return <p>{`❌ Unsupported mention (${textBlock})`}</p>;
        }

      case "equation":
        return <TeX math={textBlock.expression} />;

      case "text":
        const {
          annotations: { bold, code, italic, strikethrough, underline }
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
  const contentBlock = block[block.type];

  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <NotionText blocks={contentBlock.text} />
        </p>
      );
    case "heading_1":
      return (
        <h1>
          <NotionText blocks={contentBlock.text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2>
          <NotionText blocks={contentBlock.text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3>
          <NotionText blocks={contentBlock.text} />
        </h3>
      );
    case "bulleted_list":
      return <ul>{contentBlock?.children && contentBlock.children.map((child) => renderBlock(child))}</ul>;
    case "numbered_list":
      return <ol>{contentBlock?.children && contentBlock.children.map((child) => renderBlock(child))}</ol>;
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
          <NotionText blocks={contentBlock.text} />
          {contentBlock?.children && contentBlock.children.map((child) => renderBlock(child))}
        </li>
      );
    case "to_do":
      return (
        <label htmlFor={block.id}>
          <input type="checkbox" id={block.id} checked={contentBlock.checked} disabled />
          <NotionText blocks={contentBlock.text} />
          {contentBlock?.children && contentBlock.children.map((child) => renderBlock(child))}
        </label>
      );
    case "toggle":
      return (
        <details>
          <summary className="p-2">
            <NotionText blocks={contentBlock.text} />
          </summary>
          <div>
            {contentBlock.children?.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </div>
        </details>
      );
    case "code":
      // TODO: add captions/titles when they get added to the api
      return (
        <CodeBlock>
          <NotionText blocks={contentBlock.text} />
        </CodeBlock>
      );
    case "equation":
      return <TeX math={contentBlock.expression} block />;
    case "child_page":
      return <p>{contentBlock.title}</p>;
    case "divider":
      return <hr />;
    case "quote":
      return (
        <blockquote>
          <NotionText blocks={contentBlock.text} />
        </blockquote>
      );
    case "image":
      const src = contentBlock.type === "external" ? contentBlock.external.url : contentBlock.file.url;
      const caption = contentBlock?.caption[0]?.plain_text ?? "";
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
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
