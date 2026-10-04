import type { IconType } from "react-icons";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa6";

import {
  HiCalendarDays,
  HiEnvelope,
  HiOutlineGlobeAsiaAustralia,
} from "react-icons/hi2";

// Once UI icon names still in use by About (social buttons, globe, calendar). Removed in step C.
// Skill tags use src/resources/tagIcons.tsx (Iconoir + Simple Icons).
export const iconLibrary: Record<string, IconType> = {
  globe: HiOutlineGlobeAsiaAustralia,
  calendar: HiCalendarDays,
  email: HiEnvelope,
  github: FaGithub,
  linkedin: FaLinkedin,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
