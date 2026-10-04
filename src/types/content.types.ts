import type { ReactNode } from "react";
import type { zones } from "tzdata";

import type { SocialIcon } from "@/resources/socialIcons";

/** IANA time zone id, e.g. "America/Mazatlan". Drives the Header clock. */
export type IANATimeZone = Extract<keyof typeof zones, string>;

/** Image in content. width/height are a ratio (16/9), mapped to a Media ratio. */
export type ContentImage = { src: string; alt: string; width: number; height: number };

/** A page section that can be turned off without deleting its content. */
type Toggle = { display: boolean };

export type Person = {
  firstName: string;
  lastName: string;
  /** Display name. */
  name: string;
  role: string;
  /** Path under /public. */
  avatar: string;
  email: string;
  /** Also shown, with "_" as spaces, as the Header location. */
  location: IANATimeZone;
  languages?: string[];
};

export type Social = Array<{
  name: string;
  icon: SocialIcon;
  link: string;
  /** Shown as a button on About. */
  essential?: boolean;
}>;

/** Fields every routed page has: navigation label and SEO. */
export interface PageConfig {
  path: `/${string}`;
  label: string;
  title: string;
  description: string;
  /** Open Graph image under /public; otherwise one is generated from the title. */
  image?: string;
}

export interface Home extends PageConfig {
  image: string;
  headline: ReactNode;
  /** Link above the headline to the featured case study. */
  featured: Toggle & { label: string; title: string; href: string };
  subline: ReactNode;
}

export interface About extends PageConfig {
  /** Numbered section index in the aside (desktop). */
  tableOfContent: Toggle;
  avatar: Toggle;
  /** "Schedule a call" primary action. */
  calendar: Toggle & { link: string };
  intro: Toggle & { title: string; description: ReactNode };
  work: Toggle & {
    title: string;
    experiences: Array<{
      company: string;
      timeframe: string;
      role: string;
      achievements: ReactNode[];
      images?: ContentImage[];
    }>;
  };
  studies: Toggle & {
    title: string;
    institutions: Array<{ name: string; description: ReactNode }>;
  };
  technical: Toggle & {
    title: string;
    skills: Array<{
      title: string;
      description?: ReactNode;
      /** `icon` is a key of src/resources/tagIcons.tsx. */
      tags?: Array<{ name: string; icon?: string }>;
      images?: ContentImage[];
    }>;
  };
}

export interface Work extends PageConfig {}
