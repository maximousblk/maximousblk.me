import GistLayout from "@/layouts/gist";
import { getBlockChildren, getDatabase, getIndex } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import type { GetStaticPropsContext, GetStaticPropsResult } from "next";

export default function Gist({ blocks, slug, title, description, hide_description }) {
  return (
    <GistLayout slug={slug} title={title} description={description} hide_description={hide_description}>
      <NotionContent blocks={blocks} />
    </GistLayout>
  );
}

export async function getStaticProps({ params: { slug } }: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  const index = await getIndex();
  const gists = await getDatabase(index.gists.id);

  // @ts-ignore
  const gist = gists.results.find((gist) => gist.properties.slug.rich_text.map((slug) => slug.plain_text).join("__") === slug);
  if (!gist) return { notFound: true };

  const blocks = await getBlockChildren(gist.id);
  // @ts-ignore
  const title = gist.properties.title.title.map((part) => part.plain_text).join(" ");
  // @ts-ignore
  const description = gist.properties.description.rich_text.map((part) => part.plain_text).join(" ");
  // @ts-ignore
  const hide_description = gist.properties.hide_description.checkbox;

  return { props: { blocks, title, description, slug, hide_description }, revalidate: 10800 };
}

export async function getStaticPaths() {
  const index = await getIndex();
  const gists = await getDatabase(index.gists.id);

  return {
    paths: gists.results
      .filter((gist) => {
        // @ts-ignore
        return gist.properties.published.checkbox;
      })
      .map((gist) => ({
        params: {
          // @ts-ignore
          slug: gist.properties.slug.rich_text.map((slug) => slug.plain_text).join("__"),
        },
      })),
    fallback: "blocking",
  };
}
