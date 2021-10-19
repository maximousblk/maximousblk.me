import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import config from "@/data/config";

async function getFiles(dir: string) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat();
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const dataPath = path.join(process.cwd(), "data");
  const files: string[] = await getFiles(dataPath);

  const pages = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file);
      const frontmatter = matter(content);
      return {
        isPage: file.endsWith(".mdx"),
        isPublished: frontmatter.data.published ?? false,
        path: file.replace(dataPath, "").replace("/pages", "").replace(".mdx", "")
      };
    })
  );

  const filteredPages = pages.filter((file) => {
    return file.isPage && file.isPublished;
  });

  const fields: ISitemapField[] = filteredPages.map((page) => {
    return {
      loc: config.baseUrl + page.path,
      lastmod: new Date().toISOString(),
      priority: 0.7
    };
  });

  fields.unshift(
    ...["", "/posts", "/gists"].map((route) => {
      return {
        loc: config.baseUrl + route,
        lastmod: new Date().toISOString(),
        priority: 0.7
      };
    })
  );

  return getServerSideSitemap(ctx, fields.sort());
};

function SiteMap() {}
export default SiteMap;
