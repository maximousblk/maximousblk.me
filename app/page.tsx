import { getSiteMap, getPage, getBlockChildren } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { getPlainText } from "@/lib/utils";
import { notFound } from "next/navigation";

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

  const title = getPlainText(data.page.properties.title["title"]);

  return (
    <main className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">{title}</h1>
      <div className="prose w-full max-w-none dark:prose-dark">
        <NotionContent blocks={data.blocks} />
      </div>
    </main>
  );
}
