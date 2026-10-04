/**
 * Display configuration for UI elements.
 */
export type DisplayConfig = {
  location: boolean;
};

/**
 * Route configuration for enabled/disabled routes.
 */
export type RoutesConfig = Record<`/${string}`, boolean>;

/**
 * Top-level site configuration (src/resources/site.config.ts).
 */
export type SiteConfig = {
  baseURL: string;
  display: DisplayConfig;
  routes: RoutesConfig;
};
