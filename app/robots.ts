import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/preview"],
      },
    ],
    sitemap: "https://devxstudio.agency/sitemap.xml",
    host: "https://devxstudio.agency",
  };
}
