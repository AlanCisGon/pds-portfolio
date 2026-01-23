import { getPosts } from "@/utils/utils";
import { Column } from "@once-ui-system/core";
import { ProjectCard } from "@/components";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  /**
   * CLS-safe:
   * Reserva espacio vertical aproximado para evitar layout shifts
   * cuando este bloque está near/above-the-fold.
   */
  reserveCount?: number;
  /**
   * Altura estimada por card (px). Ajusta si tus cards son más altas/bajas.
   */
  estimatedCardHeight?: number;
  /**
   * Cuántas cards deben tratarse como "priority" (ej. imágenes above-the-fold)
   */
  priorityCount?: number;
}

/**
 * Projects — CLS-safe list renderer
 *
 * - No muta arrays al ordenar
 * - Permite reservar espacio (reduce CLS) cuando se usa cerca del fold
 * - Separa responsabilidades: layout estable aquí, detalles en ProjectCard
 */
export function Projects({
  range,
  exclude,
  reserveCount = 0,
  estimatedCardHeight = 520,
  priorityCount = 2,
}: ProjectsProps) {
  // Cargar posts (asumimos sync y local)
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  // Excluir por slug
  if (exclude?.length) {
    const excludeSet = new Set(exclude);
    allProjects = allProjects.filter((post) => !excludeSet.has(post.slug));
  }

  // Ordenar sin mutar: copia antes de sort
  const sortedProjects = [...allProjects].sort((a, b) => {
    const aTime = new Date(a.metadata.publishedAt).getTime();
    const bTime = new Date(b.metadata.publishedAt).getTime();
    return bTime - aTime;
  });

  // Rango (1-indexed como ya lo usas)
  const start = range ? Math.max(0, range[0] - 1) : 0;
  const end = range
    ? Math.min(sortedProjects.length, range[1] ?? sortedProjects.length)
    : sortedProjects.length;

  const displayedProjects = sortedProjects.slice(start, end);

  // Reserva CLS-safe: si reserveCount > 0, calculamos un minHeight aproximado
  // para que el layout no "crezca" cuando cargan imágenes/fuentes.
  const minHeight =
    reserveCount > 0 ? reserveCount * estimatedCardHeight : undefined;

  return (
    <Column
      fillWidth
      gap="xl"
      marginBottom="40"
      paddingX="l"
      style={minHeight ? { minHeight } : undefined}
    >
      {displayedProjects.map((post, index) => (
        <ProjectCard
          key={post.slug}
          href={`/work/${post.slug}`}
          // Nota: tu ProjectCard original tenía priority prop,
          // la versión CLS-safe que hicimos ya no la necesita, pero si decides
          // reintroducirla, aquí queda listo.
          // priority={index < priorityCount}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          avatars={
            post.metadata.team?.map((member) => ({ src: member.avatar })) || []
          }
          link={post.metadata.link || ""}
        />
      ))}
    </Column>
  );
}
