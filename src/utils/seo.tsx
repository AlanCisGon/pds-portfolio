import type { Metadata } from "next";

import { about, baseURL, person, social } from "@/resources";

/** Default Open Graph image for a page without its own: generated from the title. */
export const ogImageFor = (title: string) => `/api/og/generate?title=${encodeURIComponent(title)}`;

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/work/project-helix". */
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Metadata API object for a page: canonical URL, Open Graph and Twitter card. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const url = `${baseURL}${path === "/" ? "" : path}`;
  const ogImage = image || ogImageFor(title);

  return {
    metadataBase: new URL(baseURL),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type,
      url,
      images: [{ url: ogImage, alt: title }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const author = {
  "@type": "Person",
  name: person.name,
  url: `${baseURL}${about.path}`,
  image: `${baseURL}${person.avatar}`,
  sameAs: social.map((item) => item.link).filter((link) => link.startsWith("http")),
};

type SchemaInput = {
  type: "WebPage" | "BlogPosting";
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
};

/** schema.org JSON-LD object for a page, authored by the site owner. */
export function pageSchema({ type, title, description, path, image, datePublished }: SchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    url: `${baseURL}${path === "/" ? "" : path}`,
    headline: title,
    description,
    image: `${baseURL}${image || ogImageFor(title)}`,
    ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
    author,
  };
}

/** Server-rendered JSON-LD script. Data is first-party; `<` is escaped so it cannot close the tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inline; content is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
