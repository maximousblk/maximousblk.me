import { MDXRemote } from "next-mdx-remote";

import { getFileBySlug } from "@/lib/mdx";
import IndexLayout from "@/layouts/index";
import MDXComponents from "@/components/MDXComponents";

export default function Uses({ mdxSource, frontMatter }) {
  return (
    <IndexLayout frontMatter={frontMatter}>
      <MDXRemote {...mdxSource} components={MDXComponents} />
    </IndexLayout>
  );
}

export async function getStaticProps() {
  const index = await getFileBySlug("pages", "home");

  return { props: index, revalidate: 3600 };
}
