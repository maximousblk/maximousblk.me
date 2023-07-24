import { notFound } from "next/navigation";
import { Metadata } from "next/types";

import config from "@/config";
import { getSiteMap, getPage, getBlockChildren } from "@/lib/notion";
import { NotionContent } from "@/lib/render";
import { getPlainText } from "@/lib/utils";

export const revalidate = 3600;

async function getData(slug: string) {
  const isUUID = slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

  if (isUUID) {
    const page = await getPage(slug);

    if (!page?.id) return { not_found: true };

    const {
      parent,
      properties: { published, title, description, hide_description },
    } = page;

    if (parent.type == "database_id" && !published[published.type]) return { not_found: true };

    const blocks = await getBlockChildren(page.id);

    return {
      blocks,
      title: getPlainText(title[title.type]),
      description: description ? getPlainText(description[description.type]) : null,
      hide_descr: hide_description ? !!hide_description[hide_description.type] : true,
    };
  } else {
    const index = await getSiteMap();

    const page = index.pages.children?.find(({ slug: sl }) => sl === slug);
    if (!page?.id) return { not_found: true };

    const {
      published,
      title,
      description,
      properties: { hide_description },
    } = page;

    if (!published) return { not_found: true };

    const blocks = await getBlockChildren(page.id);

    return { blocks, title, description, hide_descr: !!hide_description[hide_description.type] };
  }
}

export async function generateMetadata({ params, searchParams }): Promise<Metadata> {
  const { title, description, not_found } = await getData(params.slug);

  if (not_found) return notFound();

  const og_image = `${config.baseUrl}/api/og?title=${title}&description=${description}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      url: config.baseUrl + "/" + params.slug,
      images: [
        {
          url: og_image,
          alt: title,
          width: 1280,
          height: 720,
        },
      ],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: [
        {
          url: og_image,
          alt: title,
          width: 1280,
          height: 720,
        },
      ],
    },
    other: {
      "og:image": og_image,
    },
  };
}

export default async function Page({ params: { slug } }) {
  const { blocks, title, description, hide_descr, not_found } = await getData(slug);

  if (not_found) return notFound();

  return (
    <main className="mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">{title}</h1>
      {!hide_descr && <p className="mb-8 mt-2 text-gray-700 dark:text-gray-300">{description}</p>}
      <div className="prose w-full max-w-none dark:prose-dark">
        <NotionContent blocks={blocks ?? []} />
      </div>
    </main>
  );
}
export async function generateStaticParams() {
  const {
    pages: { children: pages },
  } = await getSiteMap();

  return pages
    ?.filter(({ published }) => published)
    .map(({ slug }) => {
      return { slug };
    });
}
