import type { QueryDatabaseResponse, BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { PageWithChildren } from "@jitl/notion-api";

export type NotionDB = QueryDatabaseResponse & {
  results: PageWithChildren[];
};

type BlockWithChildren = Omit<
  BlockObjectResponse,
  "archived" | "created_by" | "created_time" | "last_edited_by" | "last_edited_time" | "parent"
> & {
  children: BlockWithChildren[];
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
