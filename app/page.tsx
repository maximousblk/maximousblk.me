import { getSiteMap, getPage, getBlockChildren } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { getPlainText } from "@/lib/utils";
import { notFound } from "next/navigation";
import RoleScramble from "./roles";

export const revalidate = 3600;

async function getData() {
  const index = await getSiteMap();

  const page = await getPage(index.home.id);

  if (!page) return null;

  const blocks = await getBlockChildren(page.id);

  return { page, blocks };
}

export default async function Page() {
  const data = await getData();

  if (!data) notFound();

  return (
    <main className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
      <div className="mb-4 flex flex-col gap-4">
        <div className="inline-flex flex-wrap items-end gap-4 md:gap-8">
          <h1 className="inline text-3xl font-bold leading-none tracking-tight text-black dark:text-white md:text-5xl">Maximous Black</h1>
          <span className="select-none font-mono text-sm leading-6 text-gray-400 dark:text-gray-600 md:text-lg">
            | &apos;<b>mak</b>.si.mus blak |
          </span>
        </div>
        <RoleScramble />
      </div>
      <div className="prose w-full max-w-none dark:prose-dark">
        <NotionContent blocks={data.blocks} />
      </div>
    </main>
  );
}
