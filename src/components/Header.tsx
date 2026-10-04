import { Home, User, ViewGrid } from "iconoir-react";

import { about, display, person, routes, work } from "@/resources";
import { Header as SiteHeader } from "@/ui";

export function Header() {
  const items = [
    routes["/"] && { href: "/", label: "Home", icon: <Home /> },
    routes["/about"] && { href: "/about", label: about.label, icon: <User /> },
    routes["/work"] && { href: "/work", label: work.label, icon: <ViewGrid /> },
  ].filter((item) => !!item);

  return (
    <SiteHeader
      items={items}
      location={display.location ? person.city : ""}
      timeZone={person.location}
    />
  );
}
