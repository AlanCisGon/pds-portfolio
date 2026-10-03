import type {
  DataStyleConfig,
  DisplayConfig,
  EffectsConfig,
  FontsConfig,
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
  themeSwitcher: true,
};

// Import and set font for each variant
import { Figtree } from "next/font/google";
import { Azeret_Mono } from "next/font/google";

const heading = Figtree({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const label = Figtree({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const code = Azeret_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts: FontsConfig = {
  heading: heading,
  body: body,
  label: label,
  code: code,
};

// default customization applied to the HTML in the main layout.tsx
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

const dataStyle: DataStyleConfig = {
  variant: "flat", // flat | gradient | outline
  mode: "categorical", // categorical | divergent | sequential
  height: 24, // default chart height
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
};

const effects: EffectsConfig = {
  mask: {
    cursor: false,
    x: 45,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: true,
    opacity: 100,
    x: 50,
    y: 60,
    width: 100,
    height: 50,
    tilt: 0,
    colorStart: "accent-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: true,
    opacity: 80,
    size: "4",
    color: "brand-background-strong",
  },
  grid: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-weak",
    size: "16",
    thickness: 1,
    angle: 45,
  },
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
  fonts,
  style,
  schema,
  sameAs,
  effects,
  dataStyle,
};
