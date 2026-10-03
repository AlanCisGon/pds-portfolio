import type { IconType } from "react-icons";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa6";

import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiCalendarDays,
  HiEnvelope,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineLink,
} from "react-icons/hi2";

import {
  PiGridFourDuotone,
  PiHouseDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";

// Once UI icon names still in use (Header, Footer, ProjectCard, HeadingLink, About).
// Skill tags use src/resources/tagIcons.tsx (Iconoir + Simple Icons); the rest moves to Iconoir in I3.
export const iconLibrary: Record<string, IconType> = {
  home: PiHouseDuotone,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  arrowRight: HiArrowRight,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  openLink: HiOutlineLink,
  globe: HiOutlineGlobeAsiaAustralia,
  calendar: HiCalendarDays,
  email: HiEnvelope,
  github: FaGithub,
  linkedin: FaLinkedin,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
