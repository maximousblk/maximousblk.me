import { MDXRemote } from "next-mdx-remote";

import { getFiles, getFileBySlug } from "@/lib/mdx";
import PageLayout from "@/layouts/page";
import MDXComponents from "@/components/MDXComponents";

export default function Page({ mdxSource, frontMatter }) {

  return (
    <PageLayout frontMatter={frontMatter}>
      <MDXRemote {...mdxSource} components={MDXComponents} />
    </PageLayout>
  );
}

export async function getStaticPaths() {
  const pages = await getFiles("pages");

  return {
    paths: pages.map((s) => ({
      params: {
        slug: s.replace(/\.mdx/, "")
      }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const pages = await getFileBySlug("pages", params.slug);

  return { props: pages };
}
