import { person, social } from "@/resources";
import { socialIcons } from "@/resources/socialIcons";
import { Footer as SiteFooter } from "@/ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <SiteFooter
      signature={`© ${year} ${person.name} · ${person.city}`}
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
