import { Badge, CodeBlock, Link, List, ListItem, Tag } from "@/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { FIGMA_SPECS } from "../docs/figma-specs";
import { DOCS, getDoc, getSourceFacts } from "../docs/registry";
import { SPECIMENS } from "../docs/specimens";
import { figmaUrl } from "../docs/types";
import styles from "../page.module.css";
import { Anatomy } from "../spec/Anatomy";
import { States } from "../spec/States";
import spec from "../spec/spec.module.css";

// Spec de un componente del SDS con la plantilla de "06 Specs" de Figma (secciones 1–7), seguida de
// lo que solo sabe el código (uso, cuándo sí y cuándo no, tokens leídos del CSS). Privada: Basic Auth
// de /lab (proxy.ts) y noindex.
export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS.map((d) => ({ component: d.slug }));
}

type Props = { params: Promise<{ component: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getDoc((await params).component);
  return { title: `Lab · ${doc?.name ?? "UI"}`, robots: { index: false, follow: false } };
}

const TOKEN = /--[a-z0-9-]+/g;

/** Texto de Figma con los tokens en mono. */
function withTokens(text: string) {
  return text.split(/(--[a-z0-9-]+)/g).map((p, i) =>
    p.startsWith("--") ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: texto estático
      <code key={i} className={spec.token}>
        {p}
      </code>
    ) : (
      p
    ),
  );
}

function SpecTable({ rows }: { rows: string[][] }) {
  const [header, ...body] = rows;
  return (
    <div className={spec.tableWrap}>
      <table className={spec.table}>
        <thead>
          <tr>
            {header.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r) => (
            <tr key={r.join("|")}>
              {r.map((c, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: columnas fijas
                <td key={i}>{withTokens(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className={spec.section} aria-labelledby={id}>
      <h2 id={id} className={spec.sectionTitle}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ComponentSpec({ params }: Props) {
  const doc = getDoc((await params).component);
  if (!doc) notFound();

  const facts = await getSourceFacts(doc.name);
  const fig = FIGMA_SPECS[doc.slug];
  const sp = SPECIMENS[doc.slug];
  const index = DOCS.indexOf(doc);
  const prev = DOCS[index - 1];
  const next = DOCS[index + 1];
  const related = (doc.related ?? []).map(getDoc).filter((d) => d !== undefined);

  // Deriva: tokens que la spec de Figma nombra y que el CSS del componente no usa.
  const named = new Set(
    [...(fig?.measures ?? []), ...(fig?.tokens ?? [])].flat().flatMap((c) => c.match(TOKEN) ?? []),
  );
  const viaChild = [...named].flatMap((t) => {
    if (facts.tokens.includes(t)) return [];
    const child = Object.entries(facts.childTokens).find(([, list]) => list.includes(t));
    return child ? [`${t} (vía ${child[0]})`] : [];
  });
  const missing = [...named].filter(
    (t) =>
      !facts.tokens.includes(t) && !Object.values(facts.childTokens).some((l) => l.includes(t)),
  );
  const statesTitle = fig?.states?.some((s) => s.includes(" · ")) ? "Estados" : "Variantes";
  const forced = (labels?: string[]) => labels?.some((l) => /· (Hover|Pressed|Focus)$/.test(l));
  // Numeración corrida, sin huecos: las specs cortas del blog no tienen todas las secciones (Clara).
  let n = 0;
  const num = (title: string) => `${++n} · ${title}`;
  const wideCard = doc.slug === "card" ? FIGMA_SPECS["card-wide"] : undefined;

  return (
    <div className={styles.page} lang="es">
      <header className={styles.intro}>
        <Link href="/lab/ui" kind="standalone" back>
          Componentes
        </Link>
        <p className={spec.crumb}>{fig?.crumb ?? "SDS / Specs / Utilidades"}</p>
        <h1 className={styles.title}>{doc.name}</h1>
        <p className={styles.lead}>{fig?.description ?? doc.summary}</p>
        <div className={styles.row}>
          {doc.unused ? (
            <Badge tone="warning">Sin uso público</Badge>
          ) : (
            <Badge tone="success">En producción</Badge>
          )}
          <Tag size="small">{facts.client ? "Client component" : "Server component"}</Tag>
          {fig ? (
            <>
              <Link href={figmaUrl(fig.frame)}>Spec en Figma</Link>
              <Link href={figmaUrl(fig.set)}>Componente {fig.set}</Link>
            </>
          ) : (
            <Badge tone="neutral">Sin spec en Figma</Badge>
          )}
        </div>
      </header>

      <div className={spec.spec}>
        <Section id="s-anatomy" title={num("Anatomía")}>
          {fig?.parts && sp?.anatomy ? (
            <Anatomy parts={fig.parts} scale={fig.anatomyScale}>
              {sp.anatomy}
            </Anatomy>
          ) : (
            <>
              <div className={styles.demo}>{doc.demo}</div>
              {fig?.short && <p className={spec.prose}>{withTokens(fig.short.anatomy)}</p>}
            </>
          )}
        </Section>

        {(fig?.measures || fig?.short) && (
          <Section id="s-measures" title={num(fig.measures ? "Medidas" : "Medidas y tokens")}>
            {fig.measures ? (
              <SpecTable rows={fig.measures} />
            ) : (
              fig.short && <p className={spec.prose}>{withTokens(fig.short.tokens)}</p>
            )}
          </Section>
        )}

        {fig?.tokens && (
          <Section id="s-tokens" title={num("Tokens por parte")}>
            <SpecTable rows={fig.tokens} />
          </Section>
        )}

        <Section id="s-props" title={num("Variantes y props")}>
          <div className={styles.propTable}>
            <SpecTable
              rows={[
                ["Prop en código", "Valores", "Por omisión", "Propiedad en Figma", "Descripción"],
                ...doc.props.map((p) => [
                  `${p.name}${p.required ? "" : "?"}`,
                  p.type,
                  p.default ?? "—",
                  p.figma ?? "—",
                  p.description,
                ]),
              ]}
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
        </Section>

        <Section id="s-states" title={num(statesTitle)}>
          {fig?.states && sp?.specimen ? (
            <States labels={fig.states} specimen={sp.specimen} columns={fig.columns} />
          ) : (
            <div className={styles.demo}>{doc.demo}</div>
          )}
          {fig?.short && <p className={spec.prose}>{withTokens(fig.short.states)}</p>}
          {forced(fig?.states) ? (
            <p className={styles.body}>
              Render vivo del código. Hover, pressed y focus se fuerzan con{" "}
              <code>data-sds-state</code> (ADR 0010); la sección En vivo sigue siendo interactiva.
            </p>
          ) : (
            !fig?.short && <p className={styles.body}>Sin estados interactivos: es informativo.</p>
          )}
        </Section>

        {fig?.responsive && (
          <Section id="s-responsive" title={num("390 y 1280 px")}>
            {fig.responsive.map((t) => (
              <p key={t} className={spec.prose}>
                {t}
              </p>
            ))}
          </Section>
        )}

        <Section id="s-a11y" title={num("Accesibilidad")}>
          {fig?.accessibility && (
            <ul className={spec.a11y}>
              {fig.accessibility.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <p className={styles.body}>Notas del código:</p>
          <List>
            {doc.accessibility.map((t) => (
              <ListItem key={t}>{t}</ListItem>
            ))}
          </List>
        </Section>

        {fig?.motion && (
          <Section id="s-motion" title="Movimiento">
            {fig.motion.map((t) => (
              <p key={t} className={spec.prose}>
                {withTokens(t)}
              </p>
            ))}
          </Section>
        )}

        {wideCard && SPECIMENS["card-wide"]?.specimen && (
          <Section id="s-card-wide" title="Layout wide | grid · tarjeta de artículo">
            <p className={spec.crumb}>
              {wideCard.crumb} · <Link href={figmaUrl(wideCard.frame)}>Spec 408:1841</Link>
            </p>
            {wideCard.short && (
              <>
                <p className={spec.prose}>{withTokens(wideCard.short.anatomy)}</p>
                <p className={spec.prose}>{withTokens(wideCard.short.tokens)}</p>
              </>
            )}
            <States
              labels={wideCard.states ?? []}
              specimen={SPECIMENS["card-wide"].specimen}
              columns={wideCard.columns}
            />
            {[...(wideCard.responsive ?? []), ...(wideCard.motion ?? [])].map((t) => (
              <p key={t} className={spec.prose}>
                {t}
              </p>
            ))}
            <ul className={spec.a11y}>
              {(wideCard.accessibility ?? []).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Section>
        )}

        {fig && <p className={spec.status}>{`${fig.status} · Set de Figma ${fig.set}`}</p>}

        <Section id="s-demo" title="En vivo">
          <div className={styles.demo}>{doc.demo}</div>
        </Section>

        <Section id="s-usage" title="Uso en código">
          <CodeBlock language="TSX" code={`import { ${doc.name} } from "@/ui";\n\n${doc.usage}`} />
        </Section>

        <div className={styles.columns}>
          <Section id="s-use" title="Cuándo usarlo">
            <List>
              {doc.use.map((t) => (
                <ListItem key={t}>{t}</ListItem>
              ))}
            </List>
          </Section>
          <Section id="s-avoid" title="Cuándo no">
            <List>
              {doc.avoid.map((t) => (
                <ListItem key={t}>{t}</ListItem>
              ))}
            </List>
          </Section>
        </div>

        <Section id="s-code-tokens" title="Tokens leídos del código">
          <p className={styles.body}>Del CSS del componente, en cada build.</p>
          {missing.length > 0 && (
            <p className={`${styles.body} ${spec.drift}`}>
              La spec de Figma nombra{" "}
              {missing.length === 1 ? "un token" : `${missing.length} tokens`} que este CSS no usa:{" "}
              {missing.join(", ")}. Puede venir de un componente hijo o ser deriva; lo confirma
              Clara.
            </p>
          )}
          {viaChild.length > 0 && (
            <p className={styles.body}>Vía componentes hijos: {viaChild.join(", ")}.</p>
          )}
          <ul className={styles.tokens}>
            {facts.tokens.map((t) => (
              <li key={t}>
                <code className={styles.code}>{t}</code>
              </li>
            ))}
          </ul>
          <ul className={styles.tokens}>
            {facts.files.map((f) => (
              <li key={f}>
                <code className={styles.code}>{f}</code>
              </li>
            ))}
          </ul>
        </Section>

        {related.length > 0 && (
          <Section id="s-related" title="Relacionados">
            <div className={styles.row}>
              {related.map((r) => (
                <Link key={r.slug} href={`/lab/ui/${r.slug}`} kind="standalone">
                  {r.name}
                </Link>
              ))}
            </div>
          </Section>
        )}
      </div>

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
