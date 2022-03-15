import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import type { BlockWithChildren, PageWithChildren } from "@jitl/notion-api";

export type NotionDB = QueryDatabaseResponse & {
  results: PageWithChildren[];
};

export type NotionBlock =
  | {
      id: string;
      type: "bulleted_list";
      bulleted_list: { children: BlockWithChildren[] };
    }
  | {
      id: string;
      type: "numbered_list";
      numbered_list: { children: BlockWithChildren[] };
    }
  | BlockWithChildren;

export interface TableOfContentsItem {
  title: string;
  type?: string;
  children?: TableOfContentsItem[];
}
