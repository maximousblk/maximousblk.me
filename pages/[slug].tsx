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
  // @ts-ignore
  const page = pages.results.find((page) => page.properties.slug.rich_text.map((slug) => slug.plain_text).join("__") === slug);
  if (!page) return { notFound: true };

  const blocks = await getBlockChildren(page.id);
  // @ts-ignore
  const title = page.properties.name.title.map((part) => part.plain_text).join(" ");
  // @ts-ignore
  const description = page.properties.description.rich_text.map((part) => part.plain_text).join(" ");
  // @ts-ignore
  const hide_descr = page.properties.hide_description.checkbox;

  return { props: { blocks, title, description, hide_descr, slug }, revalidate: 3600 };
}

export async function getStaticPaths() {
  const index = await getIndex();
  const pages = await getDatabase(index.pages.id);

  return {
    paths: pages.results
      .filter((post) => {
        // @ts-ignore
        return post.properties.published.checkbox;
      })
      .map((page) => ({
        params: {
          // @ts-ignore
          slug: page.properties.slug.rich_text.map((slug) => slug.plain_text).join("__"),
        },
      })),
    fallback: "blocking",
  };
}
