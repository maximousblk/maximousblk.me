import { unstable_cache } from "next/cache";
import { Client } from "@notionhq/client";
import type { NotionBlock, TableOfContentsItem } from "@/lib/types";
import { getPlainText, slugify, blockID } from "@/lib/utils";
import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    // console.debug("[notion] fetch", input);

    return fetch(input, {
      next: { revalidate: 3600 },
      ...init,
    });
  },
});

export const getSiteMap = unstable_cache(_getSiteMap, undefined, { revalidate: Number(process.env.NOTION_PAGE_REVALIDATE) });
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
  const epoch = Math.floor(Date.now() / 1000);
  // console.time(`[notion] getSiteMap ${epoch}`);

  const { results: root } = await getDatabase(process.env.NOTION_INDEX);

  const sitemap = await Promise.all(
    root.map(async ({ properties: { name, page: pageId } }: PageObjectResponse) => {
      const pageName = getPlainText(name[name.type]);
      const page = pageId[pageId.type].find(({ type }) => type === "mention").mention;

      const children =
        page.type == "database"
          ? (await getDatabase(page.database.id)).results.map(
              ({
                properties: { published, title, description, ...properties },
                last_edited_time,
                cover,
                id,
                object,
              }: PageObjectResponse) => {
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
              },
            )
          : null;

      return { name: pageName, id: page[page.type].id, type: page.type, title: page[page.type].title, children };
    }),
  ).then((pages) =>
    pages.reduce((acc, { name, ...props }) => {
      acc[name] = { ...props };
      return acc;
    }, {}),
  );

  // console.timeEnd(`[notion] getSiteMap ${epoch}`);

  return sitemap;
}

export const getDatabase = unstable_cache(_getDatabase, undefined, { revalidate: Number(process.env.NOTION_PAGE_REVALIDATE) });
async function _getDatabase(database_id: string) {
  const epoch = Math.floor(Date.now() / 1000);
  // console.time(`[notion] getDatabase ${database_id} ${epoch}`);

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

  // console.timeEnd(`[notion] getDatabase ${database_id} ${epoch}`);

  return db;
}

export const getPage = unstable_cache(_getPage, undefined, { revalidate: Number(process.env.NOTION_PAGE_REVALIDATE) });
async function _getPage(page_id: string) {
  const epoch = Math.floor(Date.now() / 1000);
  // console.time(`[notion] getPage ${page_id} ${epoch}`);

  const page = (await notion.pages.retrieve({ page_id })) as PageObjectResponse;

  // console.timeEnd(`[notion] getPage ${page_id} ${epoch}`);

  return page;
}

export const getBlockChildren = unstable_cache(_getBlockChildren, undefined, { revalidate: Number(process.env.NOTION_PAGE_REVALIDATE) });
async function _getBlockChildren(block_id: string): Promise<NotionBlock[]> {
  const epoch = Math.floor(Date.now() / 1000);
  // console.time(`[notion] getBlockChildren ${block_id} ${epoch}`);

  const list = await notion.blocks.children.list({ block_id });

  while (list.has_more) {
    const { results, has_more, next_cursor } = await notion.blocks.children.list({ block_id, start_cursor: list.next_cursor });
    list.results = list.results.concat(results);
    list.has_more = has_more;
    list.next_cursor = next_cursor;
  }

  const children = await Promise.all(
    list.results
      .filter(({ has_children, type }: BlockObjectResponse) => !["unsupported", "child_page"].includes(type) && has_children)
      .map(async ({ id }) => {
        return { id, children: await getBlockChildren(id) };
      }),
  );

  const blocks = list.results.map((block: BlockObjectResponse) => {
    if (!["unsupported", "child_page"].includes(block.type) && block.has_children && !block[block.type].children) {
      block[block.type].children = children.find(({ id }) => id === block.id)?.children;
    }
    return block;
  });

  const blockChildren = await Promise.all(
    blocks.map(async (block) => {
      const contents = block[block.type];
      switch (block.type) {
        case "table_of_contents":
          block.table_of_contents["children"] = blocks
            .filter(({ type }) => ["heading_1", "heading_2", "heading_3"].includes(type))
            .map((block: BlockObjectResponse) => {
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
    }),
  ).then((blocks: BlockObjectResponse[]) => {
    return blocks.reduce((acc: NotionBlock[], curr: NotionBlock) => {
      if (curr.type === "bulleted_list_item") {
        if (acc[acc.length - 1]?.type === "bulleted_list") {
          acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
        } else {
          acc.push({
            id: blockID.next().value || "",
            type: "bulleted_list",
            bulleted_list: { children: [curr] },
          });
        }
      } else if (curr.type === "numbered_list_item") {
        if (acc[acc.length - 1]?.type === "numbered_list") {
          acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
        } else {
          acc.push({
            id: blockID.next().value || "",
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

  // console.timeEnd(`[notion] getBlockChildren ${block_id} ${epoch}`);

  return blockChildren;
}
