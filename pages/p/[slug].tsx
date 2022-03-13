import PageLayout from "@/layouts/page";

import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { getBlockChildren, getPage } from "@/lib/notion";
import { NotionContent } from "@/lib/render";

export default function Page({ blocks, title, slug }) {
  if (!blocks) return null;

  return (
    <PageLayout title={title} slug={slug} description={title} hide_description>
      <NotionContent blocks={blocks} />
    </PageLayout>
  );
}

export async function getStaticProps({ params: { slug } }: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  try {
    const {
      properties: { title: pageTitle },
    } = await getPage(slug.toString());
    const blocks = await getBlockChildren(slug.toString());

    const title = pageTitle[pageTitle.type].map(({ plain_text }) => plain_text).join(" ");

    return { props: { blocks, title, slug }, revalidate: 1800 };
  } catch (e) {
    if (e.code == "object_not_found") {
      return { notFound: true };
    } else {
      throw e;
    }
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}
