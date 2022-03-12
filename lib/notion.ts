import { Client } from "@notionhq/client";
import type { GetBlockResponse } from "@notionhq/client/build/src/api-endpoints";
import type { TableOfContentsItem } from "@/components/TableOfContents";
import readingTime, { type ReadTimeResults } from "reading-time";
import getImageSize from "probe-image-size/sync";
import { unfurl } from "unfurl.js";
import { slugify } from "@/lib/utils";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getIndex(): Promise<{
  [key: string]: { id: string; type: string; children?: { id: string; type: string; slug: string }[] };
}> {
  const { results: root } = await getDatabase(process.env.NOTION_INDEX);

  return (
    await Promise.all(
      root.map(async ({ properties: { name, page: pageId } }) => {
        const pageName = name[name.type].map(({ plain_text }) => plain_text).join("");
        const page = pageId[pageId.type].find(({ type }) => type === "mention").mention;

        const children =
          page.type == "database"
            ? (await getDatabase(page.database.id)).results.map(({ properties, id, object }) => {
                return { id, type: object, slug: slugify(properties.title[properties.title.type].map(({ plain_text }) => plain_text)) };
              })
            : undefined;

        return { name: pageName, id: page[page.type].id, type: page.type, children };
      })
    )
  ).reduce((acc, { name, ...props }) => {
    acc[name] = { ...props };
    return acc;
  }, {});
}

export async function getDatabase(database_id: string) {
  const db = await notion.databases.query({ database_id });

  while (db.has_more) {
    const { results, has_more, next_cursor } = await notion.databases.query({
      database_id,
      start_cursor: db.next_cursor,
    });
    db.results = [...db.results, ...results];
    db.has_more = has_more;
    db.next_cursor = next_cursor;
  }

  return db;
}

export async function getPage(page_id: string) {
  return await notion.pages.retrieve({ page_id });
}

// extend GetBlockResponse type to include "list"
export type NotionBlock =
  | {
      id: string;
      type: "bulleted_list";
      bulleted_list: { children: GetBlockResponse[] };
    }
  | {
      id: string;
      type: "numbered_list";
      numbered_list: { children: GetBlockResponse[] };
    }
  | GetBlockResponse;

export async function getBlockChildren(block_id: string): Promise<NotionBlock[]> {
  const list = await notion.blocks.children.list({
    block_id,
  });

  while (list.has_more) {
    const { results, has_more, next_cursor } = await notion.blocks.children.list({
      block_id,
      start_cursor: list.next_cursor,
    });
    list.results = list.results.concat(results);
    list.has_more = has_more;
    list.next_cursor = next_cursor;
  }

  const children = await Promise.all(
    list.results
      .filter(({ has_children, type }) => !["unsupported", "child_page"].includes(type) && has_children)
      .map(async ({ id }) => {
        return { id, children: await getBlockChildren(id) };
      })
  );

  const blocks = list.results.map((block) => {
    if (!["unsupported", "child_page"].includes(block.type) && block.has_children && !block[block.type].children) {
      block[block.type].children = children.find(({ id }) => id === block.id)?.children;
    }
    return block;
  });

  return await Promise.all(
    blocks.map(async (block) => {
      const contents = block[block.type];
      switch (block.type) {
        case "table_of_contents":
          // @ts-ignore - `table_of_contents` is supposed to be a empty object
          block.table_of_contents["children"] = blocks
            .filter(({ type }) => ["heading_1", "heading_2", "heading_3"].includes(type))
            .map((block) => {
              return {
                title: block[block.type].rich_text.map(({ plain_text }) => plain_text).join(""),
                type: block.type,
                children: [],
              };
            })
            .reduce((acc: TableOfContentsItem[], curr: TableOfContentsItem) => {
              if (curr.type === "heading_1") {
                acc.push({ ...curr, children: [] });
              } else if (curr.type === "heading_2") {
                const prev = acc[acc.length - 1];
                if (prev?.type === "heading_1") {
                  prev.children.push(curr);
                } else {
                  acc.push(curr);
                }
              } else if (curr.type === "heading_3") {
                const prev = acc[acc.length - 1];
                const prevprev = prev?.children[prev.children.length - 1];
                if (prevprev?.type === "heading_2") {
                  prevprev.children.push(curr);
                } else if (prev?.type === "heading_1") {
                  prev.children?.push(curr);
                } else {
                  acc.push(curr);
                }
              }
              return acc;
            }, []);
          break;

        case "image":
          block.image["size"] = await fetch(contents[contents.type].url)
            .then((res) => res.arrayBuffer())
            .then((data) => getImageSize(Buffer.from(data)));
          break;

        case "link_to_page":
          const {
            properties: { title },
          } = await getPage(contents[contents.type]);
          block.link_to_page["title"] = title[title.type].map(({ plain_text }) => plain_text).join("");
          break;

        case "link_preview":
        case "bookmark":
          const og_data = await unfurl(contents.url);
          const image = og_data.open_graph?.images?.[0] || null;

          block[block.type]["meta"] = {
            title: og_data.title || og_data.twitter_card?.title || og_data.open_graph?.title || null,
            description: og_data.description || og_data.open_graph?.description || null,
            url: contents.url,
          };

          if (image && image.height && image.width) {
            block[block.type]["meta"].image = image;
          } else if (image && (image.secure_url || image.url)) {
            const { height, width } = await fetch(image.secure_url || image.url)
              .then((res) => res.arrayBuffer())
              .then((data) => getImageSize(Buffer.from(data)));
            block[block.type]["meta"].image = {
              ...image,
              url: image.secure_url || image.url,
              height,
              width,
            };
          }
          break;

        case "synced_block":
          if (contents.synced_from != null) {
            const source_block = await getBlockChildren(contents.synced_from.block_id);
            block[block.type]["children"] = source_block;
          }
          break;

        default:
          break;
      }

      return block;
    })
  ).then((blocks) => {
    return blocks.reduce((acc: NotionBlock[], curr: NotionBlock) => {
      if (curr.type === "bulleted_list_item") {
        if (acc[acc.length - 1]?.type === "bulleted_list") {
          acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
        } else {
          acc.push({
            id: getRandomInt(10 ** 99, 10 ** 100).toString(),
            type: "bulleted_list",
            bulleted_list: { children: [curr] },
          });
        }
      } else if (curr.type === "numbered_list_item") {
        if (acc[acc.length - 1]?.type === "numbered_list") {
          acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
        } else {
          acc.push({
            id: getRandomInt(10 ** 99, 10 ** 100).toString(),
            type: "numbered_list",
            numbered_list: { children: [curr] },
          });
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  });
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getReadingTime(blocks: NotionBlock[]): ReadTimeResults {
  const words: string = blocks.reduce((acc, block) => {
    if (block[block.type].text?.length) {
      return acc + block[block.type].text.map(({ plain_text }) => plain_text).join(" ");
    }
    return acc;
  }, "");

  return readingTime(words);
}
