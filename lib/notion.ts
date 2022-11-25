import { cache } from "react";
import { Client } from "@notionhq/client";
import type { BlockWithChildren, PageWithChildren } from "@jitl/notion-api";
import type { NotionBlock, TableOfContentsItem } from "@/lib/types";
import { getPlainText, slugify } from "@/lib/utils";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    console.debug("[notion] fetch", input);

    return fetch(input, {
      next: { revalidate: 3600 },
      ...init,
    });
  },
});

export const getSiteMap = cache(_getSiteMap);
async function _getSiteMap(): Promise<{
  [key: string]: {
    id: string;
    type: string;
    children?: {
      id: string;
      type: string;
      cover?: string;
      last_edited_time: string;
      title: string;
      description: string;
      published: boolean;
      slug: string;
      properties: any;
    }[];
  };
}> {
  const { results: root } = await getDatabase(process.env.NOTION_INDEX);

  return await Promise.all(
    root.map(async ({ properties: { name, page: pageId } }: PageWithChildren) => {
      const pageName = getPlainText(name[name.type]);
      const page = pageId[pageId.type].find(({ type }) => type === "mention").mention;

      const children =
        page.type == "database"
          ? (await getDatabase(page.database.id)).results.map(
              ({ properties: { published, title, description, ...properties }, last_edited_time, cover, id, object }: PageWithChildren) => {
                return {
                  id,
                  type: object,
                  cover: cover ? cover[cover.type].url : null,
                  last_edited_time,
                  title: getPlainText(title[title.type]),
                  description: getPlainText(description[description.type]),
                  published: published[published.type],
                  slug: slugify(getPlainText(title[title.type])),
                  properties,
                };
              }
            )
          : null;

      return { name: pageName, id: page[page.type].id, type: page.type, title: page[page.type].title, children };
    })
  ).then((pages) =>
    pages.reduce((acc, { name, ...props }) => {
      acc[name] = { ...props };
      return acc;
    }, {})
  );
}

export const getDatabase = cache(_getDatabase);
async function _getDatabase(database_id: string) {
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

export const getPage = cache(_getPage);
async function _getPage(page_id: string) {
  return (await notion.pages.retrieve({ page_id })) as PageWithChildren;
}

export const getBlockChildren = cache(_getBlockChildren);
async function _getBlockChildren(block_id: string): Promise<NotionBlock[]> {
  const list = await notion.blocks.children.list({ block_id });

  while (list.has_more) {
    const { results, has_more, next_cursor } = await notion.blocks.children.list({ block_id, start_cursor: list.next_cursor });
    list.results = list.results.concat(results);
    list.has_more = has_more;
    list.next_cursor = next_cursor;
  }

  const children = await Promise.all(
    list.results
      .filter(({ has_children, type }: BlockWithChildren) => !["unsupported", "child_page"].includes(type) && has_children)
      .map(async ({ id }) => {
        return { id, children: await getBlockChildren(id) };
      })
  );

  const blocks = list.results.map((block: BlockWithChildren) => {
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
          block.table_of_contents["children"] = blocks
            .filter(({ type }) => ["heading_1", "heading_2", "heading_3"].includes(type))
            .map((block: BlockWithChildren) => {
              return {
                title: getPlainText(block[block.type].rich_text),
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

        case "link_to_page":
          const {
            properties: { title },
          } = await getPage(contents[contents.type]);
          block.link_to_page["title"] = getPlainText(title[title.type]);
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
  ).then((blocks: BlockWithChildren[]) => {
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
