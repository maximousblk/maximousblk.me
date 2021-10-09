import { Fragment } from "react";

import { getIndex, getPage, getBlockChildren, getDatabase } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { GetStaticPropsContext, GetStaticPropsResult, GetServerSideProps } from "next";

import NotionLayout from "@/layouts/notion";

export default function Page({ page, blocks }) {
  if (!page || !blocks) {
    return null;
  }
  return (
    <NotionLayout title={page.properties.Name.title[0].plain_text} slug="" description="" hide_description>
      <NotionContent blocks={blocks} />
    </NotionLayout>
  );
}

export async function getStaticProps({ params }: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  // const index = await getIndex();
  const page = await getPage("df418742b19d425485e3ca47e31cfd86");
  const blocks = await getBlockChildren(page.id);

  return { props: { page, blocks }, revalidate: 3600 };
}
