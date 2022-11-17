import { getIndex, getPage } from "@/lib/notion";
import SEO from "./seo";

import config from "@/config";

export const revalidate = 4000;

async function getData() {
  const index = await getIndex();

  const page = await getPage(index.home.id);

  if (!page) return null;

  const title = page.properties.title["title"].map(({ plain_text }) => plain_text).join("");

  return { title };
}

export default async function Head() {
  const { title } = await getData();

  const { description, baseUrl: url } = config;

  return (
    <>
      <title>{config.name}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />

      <SEO title={title} description={description} url={url} />
    </>
  );
}
