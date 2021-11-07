import PostLayout from "@/layouts/post";
import { getBlockChildren, getDatabase, getIndex } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { parseISO } from "date-fns";
import type { GetStaticPropsContext, GetStaticPropsResult } from "next";

export default function Blog({ blocks, slug, title, description, image, publishedAt }) {
  return (
    <PostLayout title={title} slug={slug} description={description} image={image} publishedAt={publishedAt}>
      <NotionContent blocks={blocks} />
    </PostLayout>
  );
}

export async function getStaticProps({ params: { slug } }: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  const index = await getIndex();
  const posts = await getDatabase(index.posts.id);

  // @ts-ignore
  const post = posts.results.find((post) => post.properties.slug.rich_text.map((slug) => slug.plain_text).join("__") === slug);
  const blocks = await getBlockChildren(post.id);
  // @ts-ignore
  const title = post.properties.title.title.map((part) => part.plain_text).join(" ");
  // @ts-ignore
  const description = post.properties.description.rich_text.map((part) => part.plain_text).join(" ");
  // @ts-ignore
  const publishedAt = parseISO(post.properties.date.date.start).getTime();

  return { props: { blocks, title, description, slug, publishedAt }, revalidate: 14400 };
}

export async function getStaticPaths() {
  const index = await getIndex();
  const pages = await getDatabase(index.posts.id);

  return {
    paths: pages.results
      .filter((post) => {
        // @ts-ignore
        return post.properties.published.checkbox;
      })
      .map((page) => ({
        params: {
          // @ts-ignore
          slug: page.properties.slug.rich_text.map((slug) => slug.plain_text).join("__")
        }
      })),
    fallback: false
  };
}
