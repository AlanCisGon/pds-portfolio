import { work } from "@/resources";
import { Stat, StatGrid, type StatUnit } from "@/ui";

export type CaseStat = {
  value?: string;
  unit: StatUnit;
  label: string;
  period?: string;
  source?: string;
};

const isComplete = (s: CaseStat) => Boolean(s.value && s.period && s.source);

/** How a screen reader reads the figure: "+2 percentage points", "down 60 percent". */
function readable({ value = "", unit }: CaseStat) {
  const { statUnits, statDecrease } = work.caseStudy;
  const decrease = /^[−-]/.test(value);
  const figure = decrease ? `${statDecrease} ${value.slice(1)}` : value;
  return `${figure} ${statUnits[unit]}`;
}

/**
 * Headline metrics of a case study (MDX: <CaseStats stats={[...]} />).
 * A case with no complete metric shows no block at all; "pending" only marks a gap among real metrics.
 */
export function CaseStats({ stats }: { stats: CaseStat[] }) {
  if (!stats.some(isComplete)) return null;
  return (
    <StatGrid>
      {stats.map((s) => (
        <Stat
          key={s.label}
          {...s}
          accessibleValue={isComplete(s) ? readable(s) : undefined}
          pendingLabel={work.caseStudy.statPending}
        />
      ))}
    </StatGrid>
  );
}
