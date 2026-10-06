import { TeamCard } from "@/ui";
import { slugify } from "@/utils/slugify";
import styles from "./TeamGrid.module.css";

type Member = { name: string; role: string; description: string; avatar?: string };

export type TeamGridProps = {
  /** Group label for the human (e.g. "Human · makes the calls"). Copy lives in the MDX. */
  humanLabel: string;
  human: Member;
  /** Group label for the agents (e.g. "Somara Studio · AI agents"). */
  agentsLabel: string;
  agents: Member[];
};

/** Case-study team pattern · Figma 03 Patterns, "TeamGrid · case study" (84:87). */
export function TeamGrid({ humanLabel, human, agentsLabel, agents }: TeamGridProps) {
  const humanId = `team-${slugify(humanLabel)}`;
  const agentsId = `team-${slugify(agentsLabel)}`;
  return (
    <div className={styles.grid}>
      <section className={styles.group} aria-labelledby={humanId}>
        <p id={humanId} className={styles.label}>
          {humanLabel}
        </p>
        <TeamCard name={human.name} role={human.role} avatarSrc={human.avatar}>
          {human.description}
        </TeamCard>
      </section>
      <section className={styles.group} aria-labelledby={agentsId}>
        <p id={agentsId} className={styles.label}>
          {agentsLabel}
        </p>
        <ul className={styles.agents}>
          {agents.map((agent) => (
            <li key={agent.name} className={styles.agent}>
              <TeamCard name={agent.name} role={agent.role} avatarSrc={agent.avatar}>
                {agent.description}
              </TeamCard>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
