import type { NextApiRequest, NextApiResponse } from "next";

const preview = async (req: NextApiRequest, res: NextApiResponse) => {
  const { key, reset, redirect } = req.query;

  console.log(6969, { key, reset, redirect });

  if (reset != undefined) {
    res.clearPreviewData();

    res.status(202);
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
    if (redirect) {
      res.redirect(307, redirect as string);
    } else {
      res.json({ success: true, message: "Preview mode disabled" });
    }
  } else if ((key as string) == (process.env.PREVIEW_KEY)) {
    res.setPreviewData({}, { maxAge: 86400 });

    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
    if (redirect) {
      res.redirect(307, redirect as string);
    } else {
      res.status(202);
      res.json({ success: true, message: "Preview mode enabled" });
    }
  } else {
    res.status(401);
    res.json({ success: false, message: "Invalid key" });
  }
};

export default preview;
