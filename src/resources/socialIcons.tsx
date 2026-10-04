import { Github, Linkedin, Mail } from "iconoir-react";
import type { ReactNode } from "react";

export const socialIcons = {
  github: <Github />,
  linkedin: <Linkedin />,
  email: <Mail />,
} satisfies Record<string, ReactNode>;

export type SocialIcon = keyof typeof socialIcons;
