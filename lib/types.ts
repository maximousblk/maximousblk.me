import type { QueryDatabaseResponse, BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionDB = QueryDatabaseResponse & {
  results: PageObjectResponse[];
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
      bulleted_list: { children: BlockObjectResponse[] };
    }
  | {
      id: string;
      type: "numbered_list";
      numbered_list: { children: BlockObjectResponse[] };
    }
  | BlockObjectResponse;

export interface TableOfContentsItem {
  title: string;
  type?: string;
  children?: TableOfContentsItem[];
}
