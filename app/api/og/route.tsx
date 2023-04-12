import { ImageResponse } from "next/server";

import SITE from "@/config";

export const config = { runtime: "edge" };

function Og({ title, description }) {
  return (
    <div tw="flex items-center justify-center h-full w-full text-white bg-gray-900">
      <div tw="absolute top-[-1px] right-[-1px] m-10 flex h-[80%] w-[88%] justify-center rounded border-4 border-gray-600 bg-gray-800 opacity-90" />
      <div tw="border-4 border-gray-400 bg-gray-900 rounded flex justify-center m-8 w-[88%] h-[80%]">
        <div tw="flex flex-col justify-between m-6 w-[90%] h-[90%]">
          <div tw="flex flex-col">
            <p tw="text-7xl font-medium text-purple-300">{title}</p>
            <p tw="text-2xl font-medium text-gray-400 leading-normal">{description}</p>
          </div>
          <div tw="flex justify-between w-full mb-2 text-2xl">
            <span>
              <span tw="text-gray-200">by</span>
              <span tw="text-transparent">&quot;</span>
              <span tw="overflow-hidden font-medium">{SITE.name}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const title = url.searchParams.get("title");
  const description = url.searchParams.get("description");

  return new ImageResponse(<Og title={title || "Hello World"} description={description} />, {
    // debug: true,
    width: 1280,
    height: 720,
    emoji: "fluent",
    status: 200,
    statusText: "OK",
    headers: {
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
    fonts: [
      {
        name: "Inter",
        data: await fetch(new URL("../../../public/fonts/FiraCode-Retina.ttf", import.meta.url)).then((res) => res.arrayBuffer()),
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: await fetch(new URL("../../../public/fonts/FiraCode-Medium.ttf", import.meta.url)).then((res) => res.arrayBuffer()),
        weight: 500,
        style: "normal",
      },
      // {
      //   name: "Inter",
      //   data: await fetch(new URL("../../../public/fonts/FiraCode-Bold.ttf", import.meta.url)).then((res) => res.arrayBuffer()),
      //   weight: 700,
      //   style: "normal",
      // },
    ],
  });
}
