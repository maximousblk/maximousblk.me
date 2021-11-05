import { Client } from "@notionhq/client";
import { GetBlockResponse } from "@notionhq/client/build/src/api-endpoints";
import type { TableOfContentsItem } from "@/components/TableOfContents";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

export async function getIndex(): Promise<{ [key: string]: { id: string } }> {
  const { results } = await getDatabase(process.env.NOTION_INDEX);

  return results
    .map(({ properties }) => {
      // @ts-ignore
      const name = properties.name.title.map(({ plain_text }) => plain_text).join("");
      // @ts-ignore
      const page = properties.page.rich_text.filter(({ type }) => type === "mention")[0].mention;

      return { id: page[page.type].id, name };
    })
    .reduce((acc, { id, name }) => {
      acc[name] = { id };
      return acc;
    }, {});
}

export async function getDatabase(database_id: string) {
  const db = await notion.databases.query({ database_id });

  while (db.has_more) {
    const { results, has_more, next_cursor } = await notion.databases.query({ database_id, start_cursor: db.next_cursor });
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
    block_id
  });

  while (list.has_more) {
    const { results, has_more, next_cursor } = await notion.blocks.children.list({
      block_id,
      start_cursor: list.next_cursor
    });
    list.results = list.results.concat(results);
    list.has_more = has_more;
    list.next_cursor = next_cursor;
  }

  const children = await Promise.all(
    list.results
      .filter(({ has_children, type }) => type !== "unsupported" && has_children)
      .map(async ({ id }) => {
        return { id, children: await getBlockChildren(id) };
      })
  );

  const blocks = list.results.map((block) => {
    if (block.type != "unsupported" && block.has_children && !block[block.type].children) {
      block[block.type].children = children.find(({ id }) => id === block.id)?.children;
    }
    return block;
  });

  return blocks
    .map((block) => {
      if (block.type === "table_of_contents") {
        // @ts-ignore
        block.table_of_contents["children"] = blocks
          .filter(({ type }) => ["heading_1", "heading_2", "heading_3"].includes(type))
          .map((block) => {
            return {
              title: block[block.type].text[0].plain_text,
              type: block.type,
              children: []
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
      }
      return block;
    })
    .reduce((acc: NotionBlock[], curr: NotionBlock) => {
      if (curr.type === "bulleted_list_item") {
        if (acc[acc.length - 1]?.type === "bulleted_list") {
          // @ts-ignore
          acc[acc.length - 1].bulleted_list.children?.push(curr);
        } else {
          acc.push({ id: getRandomInt(10 ** 99, 10 ** 100).toString(), type: "bulleted_list", bulleted_list: { children: [curr] } });
        }
      } else if (curr.type === "numbered_list_item") {
        if (acc[acc.length - 1]?.type === "numbered_list") {
          // @ts-ignore
          acc[acc.length - 1].numbered_list.children?.push(curr);
        } else {
          acc.push({ id: getRandomInt(10 ** 99, 10 ** 100).toString(), type: "numbered_list", numbered_list: { children: [curr] } });
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
