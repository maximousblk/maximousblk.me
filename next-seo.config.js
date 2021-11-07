import config from "@/config";

const title = config.name;
const description = config.description;
const SEO = {
  title,
  titleTemplate: `%s - ${title}`,
  description,
  // disabled due to `double canocial address` error
  // canonical: config.baseUrl,
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: config.baseUrl,
    title,
    description,
    images: [
      {
        url: config.baseUrl + "/og.png",
        alt: title,
        width: 1280,
        height: 720,
      },
    ],
  },
  twitter: {
    handle: "@" + config.username,
    site: "@" + config.username,
    cardType: "summary_large_image",
  },
};

export default SEO;
