import { MDXRemote } from "next-mdx-remote";

import { getFiles, getFileBySlug } from "@/lib/mdx";
import GistLayout from "@/layouts/gist";
import MDXComponents from "@/components/MDXComponents";

export default function Gist({ mdxSource, frontMatter }) {
  return (
    <GistLayout frontMatter={frontMatter}>
      <MDXRemote {...mdxSource} components={MDXComponents} />
    </GistLayout>
  );
}

export async function getStaticPaths() {
  const gists = await getFiles("gists");

  return {
    paths: gists.map((s) => ({
      params: {
        slug: s.replace(/\.mdx/, "")
      }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const gist = await getFileBySlug("gists", params.slug);

  return { props: gist, revalidate: 3600 };
}
