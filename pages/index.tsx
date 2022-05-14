import { getIndex, getPage, getBlockChildren } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { GetStaticPropsResult } from "next";

import IndexLayout from "@/layouts/index";

export default function Page({ page, blocks }) {
  if (!page || !blocks) return null;

  return (
    <IndexLayout title={page.properties.title.title.map(({ plain_text }) => plain_text).join("")} description="">
      <NotionContent blocks={blocks} />
    </IndexLayout>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<any>> {
  const index = await getIndex();

  const page = await getPage(index.home.id);
  if (!page) return { notFound: true };

  const blocks = await getBlockChildren(page.id);

  return { props: { page, blocks }, revalidate: 300 };
}
