import { Footer as SiteFooter, Link } from "@/ui";
import { person, social } from "@/resources";
import { socialIcons } from "@/resources/socialIcons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <SiteFooter
      signature={
        <>
          © {year} · From 🇲🇽 by {person.name} · Built with{" "}
          {/* The Magic Portfolio template (CC BY-NC 4.0) requires attribution until it is fully replaced (step D). */}
          <Link href="https://once-ui.com/products/magic-portfolio" external>
            Once UI & Magic Portfolio
          </Link>
        </>
      }
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
