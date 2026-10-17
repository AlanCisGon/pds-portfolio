import { Badge, CodeBlock, HeadingLink, Link, List, ListItem, Table, Tag } from "@/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS, getDoc, getSourceFacts } from "../docs/registry";
import { GROUPS, figmaUrl } from "../docs/types";
import styles from "../page.module.css";

// Spec de un componente del SDS. Privada: detrás del Basic Auth de /lab (proxy.ts) y con noindex.
export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS.map((d) => ({ component: d.slug }));
}

type Props = { params: Promise<{ component: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getDoc((await params).component);
  return {
    title: `Lab · ${doc?.name ?? "UI"}`,
    robots: { index: false, follow: false },
  };
}

export default async function ComponentSpec({ params }: Props) {
  const doc = getDoc((await params).component);
  if (!doc) notFound();

  const facts = await getSourceFacts(doc.name);
  const group = GROUPS[doc.group];
  const index = DOCS.indexOf(doc);
  const prev = DOCS[index - 1];
  const next = DOCS[index + 1];
  const related = (doc.related ?? []).map(getDoc).filter((d) => d !== undefined);

  return (
    <div className={styles.page} lang="es">
      <header className={styles.intro}>
        <Link href="/lab/ui" kind="standalone" back>
          Catálogo
        </Link>
        <p className={styles.eyebrow}>
          {group.code} · {group.title.toUpperCase()}
          {doc.level ? ` · ${doc.level.toUpperCase()}` : ""}
        </p>
        <h1 className={styles.title}>{doc.name}</h1>
        <p className={styles.lead}>{doc.summary}</p>
        <div className={styles.row}>
          {doc.unused ? (
            <Badge tone="warning">Sin uso público</Badge>
          ) : (
            <Badge tone="success">En producción</Badge>
          )}
          <Tag size="small">{facts.client ? "Client component" : "Server component"}</Tag>
          {doc.figmaNode ? (
            <Link href={figmaUrl(doc.figmaNode)}>Figma {doc.figmaNode}</Link>
          ) : (
            <Badge tone="neutral">node-id de Figma pendiente</Badge>
          )}
        </div>
      </header>

      <section className={styles.section} aria-label="Demo">
        <div className={styles.demo}>{doc.demo}</div>
      </section>

      <section className={styles.section}>
        <HeadingLink id="spec-usage">Uso</HeadingLink>
        <CodeBlock language="TSX" code={`import { ${doc.name} } from "@/ui";\n\n${doc.usage}`} />
      </section>

      <section className={styles.section}>
        <HeadingLink id="spec-props">Props</HeadingLink>
        <div className={styles.propTable}>
          <Table
            caption={`Props de ${doc.name}`}
            data={{
              headers: [
                { key: "name", content: "Prop" },
                { key: "type", content: "Tipo" },
                { key: "default", content: "Por omisión" },
                { key: "figma", content: "Figma" },
                { key: "description", content: "Descripción" },
              ],
              rows: doc.props.map((p) => ({
                name: (
                  <code className={styles.code}>
                    {p.name}
                    {p.required ? "" : "?"}
                  </code>
                ),
                type: <code className={styles.code}>{p.type}</code>,
                default: p.default ? <code className={styles.code}>{p.default}</code> : "—",
                figma: p.figma ?? "—",
                description: p.description,
              })),
            }}
          />
        </div>
        <dl className={styles.propList}>
          {doc.props.map((p) => (
            <div key={p.name} className={styles.propItem}>
              <dt>
                <code className={styles.code}>
                  {p.name}
                  {p.required ? "" : "?"}
                </code>
              </dt>
              <dd className={styles.code}>
                {p.type}
                {p.default ? ` = ${p.default}` : ""}
                {p.figma ? ` · Figma: ${p.figma}` : ""}
              </dd>
              <dd className={styles.body}>{p.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className={styles.columns}>
        <section className={styles.section}>
          <HeadingLink id="spec-use">Cuándo usarlo</HeadingLink>
          <List>
            {doc.use.map((t) => (
              <ListItem key={t}>{t}</ListItem>
            ))}
          </List>
        </section>
        <section className={styles.section}>
          <HeadingLink id="spec-avoid">Cuándo no</HeadingLink>
          <List>
            {doc.avoid.map((t) => (
              <ListItem key={t}>{t}</ListItem>
            ))}
          </List>
        </section>
      </div>

      <section className={styles.section}>
        <HeadingLink id="spec-a11y">Accesibilidad</HeadingLink>
        <List>
          {doc.accessibility.map((t) => (
            <ListItem key={t}>{t}</ListItem>
          ))}
        </List>
      </section>

      <section className={styles.section}>
        <HeadingLink id="spec-tokens">Tokens</HeadingLink>
        <p className={styles.body}>Leídos de su CSS en cada build.</p>
        {facts.tokens.length > 0 ? (
          <ul className={styles.tokens}>
            {facts.tokens.map((t) => (
              <li key={t}>
                <code className={styles.code}>{t}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.body}>No usa tokens propios: hereda de sus hijos.</p>
        )}
        <ul className={styles.tokens}>
          {facts.files.map((f) => (
            <li key={f}>
              <code className={styles.code}>{f}</code>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className={styles.section}>
          <HeadingLink id="spec-related">Relacionados</HeadingLink>
          <div className={styles.row}>
            {related.map((r) => (
              <Link key={r.slug} href={`/lab/ui/${r.slug}`} kind="standalone">
                {r.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <nav className={styles.pager} aria-label="Componentes">
        {prev ? (
          <Link href={`/lab/ui/${prev.slug}`} kind="standalone" back>
            {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/lab/ui/${next.slug}`} kind="standalone">
            {next.name}
          </Link>
        )}
      </nav>
    </div>
  );
}
