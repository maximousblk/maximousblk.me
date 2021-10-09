import type { NextApiRequest, NextApiResponse } from "next";
import { notion, getIndex, getBlockChildren, getPage, getDatabase } from "@/lib/notion";

export default async function api(req: NextApiRequest, res: NextApiResponse) {
  const page = await getPage("df418742b19d425485e3ca47e31cfd86");
  const blocks = await getBlockChildren(page.id);

  res.json({ page, blocks });
}
