import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import { Children, type ComponentProps, type ReactNode, isValidElement } from "react";

import { CaseStats } from "@/components/work/CaseStats";
import { TeamGrid } from "@/components/work/TeamGrid";
import {
  Accordion,
  Callout,
  CodeBlock,
  Divider,
  HeadingLink,
  Link,
  List,
  ListItem,
  Media,
  Table,
} from "@/ui";
import { slugify } from "@/utils/slugify";
import styles from "./mdx.module.css";

type WithChildren = { children?: ReactNode };

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node.props as WithChildren).children);
  }
  return "";
}

function createHeading(as: "h2" | "h3" | "h4") {
  const MdxHeading = ({ children }: WithChildren) => (
    <HeadingLink id={slugify(textOf(children))} as={as}>
      {children}
    </HeadingLink>
  );
  MdxHeading.displayName = as;
  return MdxHeading;
}

function MdxLink({ href = "", children }: { href?: string; children?: ReactNode }) {
  // In-page anchors stay plain anchors so the browser scrolls without a client navigation.
  if (href.startsWith("#")) {
    return (
      <a href={href} className={styles.anchor}>
        {children}
      </a>
    );
  }
  return <Link href={href}>{children}</Link>;
}

function MdxImage({ src, alt = "" }: { src?: string; alt?: string }) {
  return <Media src={src} alt={alt} />;
}

// A Markdown image on its own line arrives wrapped in <p>, but Media renders a <figure>,
// which can't live inside a paragraph (invalid HTML and a hydration error), so unwrap it.
function MdxParagraph({ children }: WithChildren) {
  const parts = Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );
  if (
    parts.length > 0 &&
    parts.every((child) => isValidElement(child) && child.type === MdxImage)
  ) {
    return <>{parts}</>;
  }
  return <p className={styles.paragraph}>{children}</p>;
}

function MdxPre({ children }: WithChildren) {
  // ```lang fences arrive as <pre><code className="language-lang">.
  if (children && typeof children === "object" && "props" in children) {
    const { className = "", children: code } = children.props as {
      className?: string;
      children?: ReactNode;
    };
    return (
      <CodeBlock
        code={textOf(code).replace(/\n$/, "")}
        language={className.replace("language-", "") || "text"}
      />
    );
  }
  return <pre>{children}</pre>;
}

const components: MDXRemoteProps["components"] = {
  h1: createHeading("h2"),
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  p: MdxParagraph,
  strong: ({ children }: WithChildren) => <strong className={styles.strong}>{children}</strong>,
  a: MdxLink,
  img: MdxImage,
  ul: ({ children }: WithChildren) => <List>{children}</List>,
  ol: ({ children }: WithChildren) => <List ordered>{children}</List>,
  li: ({ children }: WithChildren) => <ListItem>{children}</ListItem>,
  hr: () => <Divider />,
  code: ({ children }: WithChildren) => <code className={styles.code}>{children}</code>,
  pre: MdxPre,
  blockquote: ({ children }: WithChildren) => (
    <blockquote className={styles.quote}>{children}</blockquote>
  ),
  // JSX blocks available to case studies.
  Table: (props: ComponentProps<typeof Table>) => <Table {...props} />,
  Callout,
  Media,
  Accordion,
  TeamGrid,
  CaseStats,
};

type CustomMDXProps = MDXRemoteProps;

export function CustomMDX(props: CustomMDXProps) {
  return (
    <div className={styles.prose}>
      <MDXRemote
        {...props}
        // MDX is first-party repo content: allow JSX expression props (data={{...}}),
        // still blocking dangerous globals (eval, process, ...).
        options={{ blockJS: false, blockDangerousJS: true, ...props.options }}
        components={{ ...components, ...(props.components || {}) }}
      />
    </div>
  );
}

/** h2 entries of an MDX source, for the case-study TableOfContents. Same slugs as the rendered headings. */
export function getHeadings(source: string): Array<{ id: string; label: string }> {
  return [...source.matchAll(/^##\s+(.+)$/gm)].map(([, raw]) => {
    const label = raw.replace(/[*_`]/g, "").trim();
    return { id: slugify(label), label };
  });
}
