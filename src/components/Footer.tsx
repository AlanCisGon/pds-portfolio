import { Footer as SiteFooter } from "@/ui";
import { person, social } from "@/resources";
import { socialIcons } from "@/resources/socialIcons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <SiteFooter
      signature={`© ${year} · From 🇲🇽 by ${person.name}`}
      social={social
        .filter((item) => item.link)
        .map((item) => ({
          href: item.link,
          label: item.name,
          icon: socialIcons[item.icon],
        }))}
    />
  );
}
