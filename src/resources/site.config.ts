import type { RoutesConfig } from "@/types";

/** Canonical origin, without a trailing slash: paths are appended as `${baseURL}/work`. */
const baseURL = "https://alancisneros.design";

/** Enabled routes: drive the Header navigation and the sitemap. */
const routes: RoutesConfig = {
  "/": true,
  "/about": true,
  "/work": true,
};

export { baseURL, routes };
