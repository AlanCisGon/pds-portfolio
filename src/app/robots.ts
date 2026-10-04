import type { MetadataRoute } from "next";

import { baseURL } from "@/resources";

// /lab is private (Basic Auth + X-Robots-Tag) and is deliberately not listed here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
