import PostLayout from "@/layouts/post";
import { getBlockChildren, getDatabase, getIndex, getReadingTime } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { parseISO } from "date-fns";
import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import getImageSize from "probe-image-size/sync";

export default function Blog({ blocks, slug, title, description, cover, publishedAt }) {
  return (
    <PostLayout
      title={title}
      slug={slug}
      description={description}
      cover={cover}
      publishedAt={publishedAt}
      readingTime={getReadingTime(blocks).text}
    >
      <NotionContent blocks={blocks} />
    </PostLayout>
  );
}

export async function getStaticProps({ params: { slug } }: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  const index = await getIndex();
  const posts = await getDatabase(index.posts.id);

  const post = posts.results.find(({ properties: { slug: sl } }) => sl[sl.type].map(({ plain_text }) => plain_text).join("__") === slug);
  if (!post) return { notFound: true };

  const { title: postTitle, description: postDescription, date, cover: coverImage } = post.properties;

  const blocks = await getBlockChildren(post.id);
  const title = postTitle[postTitle.type].map(({ plain_text }) => plain_text).join(" ");
  const description = postDescription[postDescription.type].map(({ plain_text }) => plain_text).join(" ");
  const publishedAt = parseISO(date[date.type].start).getTime();
  const coverURL = coverImage[coverImage.type][0]?.file.url;
  const cover = coverURL
    ? await fetch(coverURL)
        .then((res) => res.arrayBuffer())
        .then((data) => ({ url: coverURL, ...getImageSize(Buffer.from(data)) }))
    : null;

  return { props: { blocks, slug, title, description, cover, publishedAt }, revalidate: 2700 };
}

export async function getStaticPaths() {
  const index = await getIndex();

  return {
    paths: index.posts.children.map(({ slug }) => {
      return { params: { slug } };
    }),
    fallback: "blocking",
  };
}
