import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda";

async function getBrowserInstance(height = 900, width = 1600) {
  const executablePath = await chromium.executablePath;

  const options = {
    headless: true,
    args: chromium.args,
    defaultViewport: { width, height },
    ignoreHTTPSErrors: true,
  };

  if (!executablePath) {
    const puppeteer = await import("puppeteer");
    return puppeteer.launch(options);
  }

  return chromium.puppeteer.launch({ executablePath, ...options });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  console.debug("[screenshot] url: ", url);

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  let browser = null;

  try {
    browser = await getBrowserInstance();
    let page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot();

    res.statusCode = 200;
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, no-transform, max-age=2592000, s-maxage=2592000, stale-while-revalidate");
    res.end(screenshot);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
