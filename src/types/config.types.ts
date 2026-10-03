import {
  BorderStyle,
  NeutralColor,
  ScalingSize,
  Schemes,
  SolidStyle,
  SolidType,
  SurfaceStyle,
  Theme,
  TransitionStyle,
} from "@once-ui-system/core";

/**
 * Display configuration for UI elements.
 */
export type DisplayConfig = {
  location: boolean;
  time: boolean;
};

/**
 * Route configuration for enabled/disabled routes.
 */
export type RoutesConfig = Record<`/${string}`, boolean>;

/**
 * Style customization for main layout.
 */
export type StyleConfig = {
  theme: Theme;
  neutral: NeutralColor;
  brand: Schemes;
  accent: Schemes;
  solid: SolidType;
  solidStyle: SolidStyle;
  border: BorderStyle;
  surface: SurfaceStyle;
  transition: TransitionStyle;
  scaling: ScalingSize;
};

/**
 * Schema data for SEO/meta tags.
 */
export type SchemaConfig = {
  logo: string;
  type: string;
  name: string;
  description: string;
  email: string;
};

/**
 * Social links for organization.
 */
export type SameAsConfig = {
  threads: string;
  linkedin: string;
  discord: string;
};

/**
 * Top-level config types for once-ui.config.js
 */
export type OnceUIConfig = {
  display: DisplayConfig;
  routes: RoutesConfig;
  baseURL: string;
  style: StyleConfig;
  schema: SchemaConfig;
  sameAs: SameAsConfig;
};
