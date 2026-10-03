import type {
  DisplayConfig,
  RoutesConfig,
  SameAsConfig,
  SchemaConfig,
  StyleConfig,
} from "@/types";
import { home } from "./index";

// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL: string = "https://alancisneros.design/";

const routes: RoutesConfig = {
  "/": true,
  "/about": true,
  "/work": true,
};

const display: DisplayConfig = {
  location: true,
  time: true,
};

// Once UI theme attributes, still needed by pages not yet migrated to src/ui (removed in step D).
// The site is dark only: theme is forced in layout.tsx and Providers.
const style: StyleConfig = {
  theme: "dark",
  brand: "violet",
  accent: "indigo",
  neutral: "slate",
  border: "rounded",
  solid: "color",
  solidStyle: "flat",
  surface: "filled",
  transition: "all",
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

// default schema data
const schema: SchemaConfig = {
  logo: "",
  type: "Freelance UX Strategist",
  name: "Alan Cisneros Portfolio",
  description: home.description,
  email: "alancisgon@gmail.com",
};

// social links
const sameAs: SameAsConfig = {
  threads: " ",
  linkedin: "https://www.linkedin.com/in/alancisgon/",
  discord: " ",
};

export {
  display,
  routes,
  baseURL,
  style,
  schema,
  sameAs,
};
