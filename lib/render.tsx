import { Fragment } from "react";
import TeX from "@matejmazur/react-katex";
import { CustomLink } from "@/components/MDXComponents";
import { CodeBlock } from "@/components/CodeBlock";
import type { NotionBlock } from "@/lib/notion";

export function NotionText({ blocks }) {
  return blocks.map((block) => {
    if (!["text", "mention", "equation"].includes(block.type)) console.log("unsupported text:", block.type);

    if (block.type == "equation") {
      return <TeX math={block.equation.expression} />;
    } else if (block.type == "mention") {
      const type = block.mention.type;
      switch (type) {
        case "date":
          const date = block.mention.date;
          return (
            <span>
              {date.start}
              {date.end ? " - " : ""}
              {date.end}
            </span>
          );
        case "user":
          // const user = block.mention.user;
          return <span className="px-1 py-0.5 bg-gray-100 dark:bg-coolGray-800 rounded">{block.plain_text}</span>;
        case "page":
          const page = block.mention.page;
          return <CustomLink href={`/${page.id}`}>{block.plain_text}</CustomLink>;

        default:
          console.log(block);
      }
    }

    // else if (block.type == "text")
    const {
      annotations: { bold, code, italic, strikethrough, underline },
      text
    } = block;

    let part: JSX.Element = text?.link ? <CustomLink href={text.link?.url}>{text?.content}</CustomLink> : <>{text?.content}</>;

    if (code) part = <code>{part}</code>;
    if (bold) part = <strong>{part}</strong>;
    if (italic) part = <em>{part}</em>;
    if (strikethrough) part = <del>{part}</del>;
    if (underline) part = <u>{part}</u>;

    return (
      <span key={text} style={{ whiteSpace: "pre-wrap" }}>
        {part}
      </span>
    );
  });
}

export function renderBlock(block: NotionBlock) {
  const blockContents = block[block.type];

  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <NotionText blocks={blockContents.text} />
        </p>
      );
    case "heading_1":
      return (
        <h1>
          <NotionText blocks={blockContents.text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2>
          <NotionText blocks={blockContents.text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3>
          <NotionText blocks={blockContents.text} />
        </h3>
      );
    case "bulleted_list":
      return <ul>{blockContents?.children && blockContents.children.map((child) => renderBlock(child))}</ul>;
    case "numbered_list":
      return <ol>{blockContents?.children && blockContents.children.map((child) => renderBlock(child))}</ol>;
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
          <NotionText blocks={blockContents.text} />
          {blockContents?.children && blockContents.children.map((child) => renderBlock(child))}
        </li>
      );
    case "to_do":
      return (
        <label htmlFor={block.id}>
          <input type="checkbox" id={block.id} checked={blockContents.checked} disabled />
          <NotionText blocks={blockContents.text} />
          {blockContents?.children && blockContents.children.map((child) => renderBlock(child))}
        </label>
      );
    case "toggle":
      return (
        <details>
          <summary>
            <NotionText blocks={blockContents.text} />
          </summary>
          {blockContents.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case "code":
      // TODO: add captions/titles when they get added to the api
      return (
        <CodeBlock>
          <NotionText blocks={blockContents.text} />
        </CodeBlock>
      );
    case "equation":
      return <TeX math={blockContents.expression} block />;
    case "child_page":
      return <p>{blockContents.title}</p>;
    case "divider":
      return <hr />;
    case "quote":
      return (
        <blockquote>
          <NotionText blocks={blockContents.text} />
        </blockquote>
      );
    case "image":
      const src = blockContents.type === "external" ? blockContents.external.url : blockContents.file.url;
      const caption = blockContents?.caption[0]?.plain_text ?? "";
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
