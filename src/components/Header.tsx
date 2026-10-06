import { Home, User, ViewGrid } from "iconoir-react";

import { about, routes, work } from "@/resources";
import { Header as SiteHeader } from "@/ui";

export function Header() {
  const items = [
    routes["/"] && { href: "/", label: "Home", icon: <Home /> },
    routes["/about"] && { href: "/about", label: about.label, icon: <User /> },
    routes["/work"] && { href: "/work", label: work.label, icon: <ViewGrid /> },
  ].filter((item) => !!item);

  return (
    // No location or clock: the place lives in the colophon (decision of Alan, 2026-10-06).
    <SiteHeader items={items} />
  );
}
