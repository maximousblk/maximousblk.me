import { MDXRemote } from "next-mdx-remote";

import { getFiles, getFileBySlug } from "@/lib/mdx";
import PostLayout from "@/layouts/post";
import MDXComponents from "@/components/MDXComponents";

export default function Blog({ mdxSource, frontMatter }) {
  return (
    <PostLayout frontMatter={frontMatter}>
      <MDXRemote {...mdxSource} components={MDXComponents} />
    </PostLayout>
  );
}

export async function getStaticPaths() {
  const posts = await getFiles("posts");

  return {
    paths: posts.map((p) => ({
      params: {
        slug: p.replace(/\.mdx/, "")
      }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const post = await getFileBySlug("posts", params.slug);

  return { props: post, revalidate: 1440 };
}
