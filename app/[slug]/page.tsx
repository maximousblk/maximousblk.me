import { getSiteMap, getBlockChildren } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { notFound } from "next/navigation";

export const revalidate = 3600;

async function getData(slug: string) {
  const index = await getSiteMap();

  const {
    id: page_id,
    published,
    title,
    description,
    properties: { hide_description },
  } = index.pages.children.find(({ slug: sl }) => sl === slug);

  if (!page_id) return null;
  if (!published) return null;

  const blocks = await getBlockChildren(page_id);

  return { blocks, title, description, hide_descr: hide_description[hide_description.type] };
}

export default async function Page({ params: { slug } }) {
  const data = await getData(slug);

  if (!data) notFound();

  const { blocks, title, description, hide_descr } = data;

  return (
    <main className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">{title}</h1>
      {!hide_descr && <p className="mt-2 mb-8 text-gray-700 dark:text-gray-300">{description}</p>}
      <div className="prose w-full max-w-none dark:prose-dark">
        <NotionContent blocks={blocks} />
      </div>
    </main>
  );
}
export async function generateStaticParams() {
  const {
    pages: { children: pages },
  } = await getSiteMap();

  return pages
    .filter(({ published }) => published)
    .map(({ slug }) => {
      return { slug };
    });
}
