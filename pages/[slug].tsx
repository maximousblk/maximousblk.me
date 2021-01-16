import hydrate from "next-mdx-remote/hydrate";

import { getFiles, getFileBySlug } from "@/lib/mdx";
import PageLayout from "@/layouts/page";
import MDXComponents from "@/components/MDXComponents";

export default function Page({ mdxSource, frontMatter }) {
  const content = hydrate(mdxSource, {
    components: MDXComponents
  });

  return <PageLayout frontMatter={frontMatter}>{content}</PageLayout>;
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
