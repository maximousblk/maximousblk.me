import PageLayout from "@/layouts/page";

import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { getIndex, getBlockChildren, getDatabase } from "@/lib/notion";
import { NotionContent } from "@/lib/render";

export default function Page({ blocks, title, description, hide_descr, slug }) {
  if (!blocks) {
    return null;
  }
  return (
    <PageLayout title={title} slug={slug} description={description} hide_description={hide_descr}>
      <NotionContent blocks={blocks} />
    </PageLayout>
  );
}

export async function getStaticProps({ params: { slug } }: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  const index = await getIndex();
  const pages = await getDatabase(index.pages.id);

  const page = pages.results.find(({ properties: { slug: sl } }) => sl[sl.type].map(({ plain_text }) => plain_text).join("__") === slug);
  if (!page) return { notFound: true };

  const { title: pageTitle, description: pageDescription, hide_description } = page.properties;

  const blocks = await getBlockChildren(page.id);
  const title = pageTitle[pageTitle.type].map(({ plain_text }) => plain_text).join(" ");
  const description = pageDescription[pageDescription.type].map(({ plain_text }) => plain_text).join(" ");
  const hide_descr = hide_description[hide_description.type];

  return { props: { blocks, title, description, hide_descr, slug }, revalidate: 2700 };
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
