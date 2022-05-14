import PageLayout from "@/layouts/page";

import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { getIndex, getBlockChildren, getPage } from "@/lib/notion";
import { NotionContent } from "@/lib/render";

export default function Page({ blocks, title, description, hide_descr, slug }) {
  if (!blocks) return null;

  return (
    <PageLayout title={title} slug={slug} description={description} hide_description={hide_descr}>
      <NotionContent blocks={blocks} />
    </PageLayout>
  );
}

export async function getStaticProps({ preview = false, params: { slug } }: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  const index = await getIndex();
  const pageID = index.pages.children.find(({ slug: sl }) => sl === slug)?.id;
  if (!pageID) return { notFound: true };

  const page = await getPage(pageID);

  const { published, title: pageTitle, description: pageDescription, hide_description } = page.properties;

  if (!published[published.type] && !preview) return { notFound: true };

  const blocks = await getBlockChildren(page.id);
  const title = pageTitle[pageTitle.type].map(({ plain_text }) => plain_text).join(" ");
  const description = pageDescription[pageDescription.type].map(({ plain_text }) => plain_text).join(" ");
  const hide_descr = hide_description[hide_description.type];

  return { props: { blocks, title, description, hide_descr, slug }, revalidate: 300 };
}

export async function getStaticPaths() {
  const index = await getIndex();

  return {
    paths: index.pages.children.map(({ slug }) => {
      return { params: { slug } };
    }),
    fallback: "blocking",
  };
}
