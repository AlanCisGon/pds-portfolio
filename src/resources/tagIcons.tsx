import type { ReactNode } from "react";
import { AdobeIllustrator, AdobePhotoshop, Group } from "iconoir-react";
import {
  SiClaude,
  SiConfluence,
  SiFigma,
  SiGithub,
  SiGoogleanalytics,
  SiGooglegemini,
  SiHotjar,
  SiJira,
  SiMaze,
  SiNextdotjs,
  SiNotion,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "@icons-pack/react-simple-icons";

/**
 * Leading icons for Tag, keyed by the `icon` field in content.tsx.
 * Tool logos come from Simple Icons; concepts and the logos Simple Icons no longer ships
 * (Adobe) come from Iconoir. See docs/design-system.md → Iconografía.
 * Simple Icons get an empty title: the Tag label already names the tool (no duplicate text or native tooltip).
 */
export const tagIcons: Record<string, ReactNode> = {
  claude: <SiClaude title="" />,
  gemini: <SiGooglegemini title="" />,
  figma: <SiFigma title="" />,
  notion: <SiNotion title="" />,
  jira: <SiJira title="" />,
  confluence: <SiConfluence title="" />,
  hotjar: <SiHotjar title="" />,
  analytics: <SiGoogleanalytics title="" />,
  maze: <SiMaze title="" />,
  github: <SiGithub title="" />,
  vercel: <SiVercel title="" />,
  nextjs: <SiNextdotjs title="" />,
  react: <SiReact title="" />,
  typescript: <SiTypescript title="" />,
  tailwind: <SiTailwindcss title="" />,
  photoshop: <AdobePhotoshop />,
  illustrator: <AdobeIllustrator />,
  lead: <Group />,
};
