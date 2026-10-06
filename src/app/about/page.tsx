import { Calendar, Globe } from "iconoir-react";

import { about, person, social } from "@/resources";
import { socialIcons } from "@/resources/socialIcons";
import { tagIcons } from "@/resources/tagIcons";
import { Avatar, Button, List, ListItem, Media, type MediaRatio, TableOfContents, Tag } from "@/ui";
import { JsonLd, pageMetadata, pageSchema } from "@/utils/seo";
import { slugify } from "@/utils/slugify";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: about.title,
  description: about.description,
  path: about.path,
});

/** Content images declare a width/height ratio; Media reserves one of its fixed ratios. */
function toRatio(width: number, height: number): MediaRatio {
  const r = width / height;
  if (r > 1.5) return "16:9";
  if (r > 1.1) return "4:3";
  return "1:1";
}

export default function About() {
  const sections = [
    { id: slugify(about.intro.title), label: about.intro.title, display: about.intro.display },
    { id: slugify(about.work.title), label: about.work.title, display: about.work.display },
    {
      id: slugify(about.studies.title),
      label: about.studies.title,
      display: about.studies.display,
    },
    {
      id: slugify(about.technical.title),
      label: about.technical.title,
      display: about.technical.display,
    },
  ].filter((section) => section.display);
  const [intro, work, studies, technical] = sections.map((s) => s.id);

  return (
    <div className={styles.page}>
      <JsonLd
        data={pageSchema({
          type: "WebPage",
          title: about.title,
          description: about.description,
          path: about.path,
        })}
      />

      <aside className={styles.aside}>
        {about.avatar.display && (
          <div className={styles.profile}>
            <Avatar src={person.avatar} name={person.name} size="l" decorative />
            <p className={styles.location}>
              <span className={styles.locationIcon} aria-hidden="true">
                <Globe />
              </span>
              {person.city}
            </p>
            {person.languages && person.languages.length > 0 && (
              <ul className={styles.tags} aria-label="Languages">
                {person.languages.map((language) => (
                  <li key={language}>
                    <Tag size="small">{language}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {about.tableOfContent.display && sections.length > 1 && (
          <div className={styles.toc}>
            <TableOfContents entries={sections} title="On this page" />
          </div>
        )}
      </aside>

      <div className={styles.content}>
        <header id={intro} className={styles.header}>
          <h1 className={styles.name}>{person.name}</h1>
          <p className={styles.role}>{person.role}</p>
          <div className={styles.actions}>
            {about.calendar.display && (
              <Button
                href={about.calendar.link}
                target="_blank"
                rel="noopener noreferrer"
                leadingIcon={<Calendar />}
              >
                Schedule a call
              </Button>
            )}
            {social
              .filter((item) => item.essential && item.link)
              .map((item) => (
                <Button
                  key={item.name}
                  href={item.link}
                  variant="secondary"
                  leadingIcon={socialIcons[item.icon]}
                  {...(/^https?:/.test(item.link)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.name}
                </Button>
              ))}
          </div>
        </header>

        {about.intro.display && <p className={styles.intro}>{about.intro.description}</p>}

        {about.work.display && (
          <section className={styles.section} aria-labelledby={work}>
            <h2 id={work} className={styles.sectionTitle}>
              {about.work.title}
            </h2>
            {about.work.experiences.map((experience) => (
              <article key={`${experience.company}-${experience.role}`} className={styles.entry}>
                <div className={styles.entryHead}>
                  <h3 className={styles.entryTitle}>{experience.company}</h3>
                  <p className={styles.meta}>{experience.timeframe}</p>
                </div>
                <p className={styles.entryRole}>{experience.role}</p>
                <List>
                  {experience.achievements.map((achievement, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static ReactNode list from content.tsx, never reordered
                    <ListItem key={index}>{achievement}</ListItem>
                  ))}
                </List>
                {experience.images?.map((image) => (
                  <Media
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    ratio={toRatio(image.width, image.height)}
                    sizes="(min-width: 1024px) 720px, 100vw"
                  />
                ))}
              </article>
            ))}
          </section>
        )}

        {about.studies.display && (
          <section className={styles.section} aria-labelledby={studies}>
            <h2 id={studies} className={styles.sectionTitle}>
              {about.studies.title}
            </h2>
            {about.studies.institutions.map((institution) => (
              <article key={institution.name} className={styles.entry}>
                <h3 className={styles.entryTitle}>{institution.name}</h3>
                <p className={styles.entryText}>{institution.description}</p>
              </article>
            ))}
          </section>
        )}

        {about.technical.display && (
          <section className={styles.section} aria-labelledby={technical}>
            <h2 id={technical} className={styles.sectionTitle}>
              {about.technical.title}
            </h2>
            {about.technical.skills.map((skill) => (
              <article key={skill.title} className={styles.entry}>
                <h3 className={styles.entryTitle}>{skill.title}</h3>
                {skill.description && <p className={styles.entryText}>{skill.description}</p>}
                {skill.tags && skill.tags.length > 0 && (
                  <ul className={styles.tags}>
                    {skill.tags.map((tag) => (
                      <li key={tag.name}>
                        <Tag leadingIcon={tag.icon ? tagIcons[tag.icon] : undefined}>
                          {tag.name}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                )}
                {skill.images?.map((image) => (
                  <Media
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    ratio={toRatio(image.width, image.height)}
                    sizes="(min-width: 1024px) 720px, 100vw"
                  />
                ))}
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
