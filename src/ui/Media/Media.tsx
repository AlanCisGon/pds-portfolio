import { MediaImage } from "iconoir-react";
import Image from "next/image";
import styles from "./Media.module.css";
import { MediaVideo } from "./MediaVideo";

export type MediaRatio = "16:9" | "4:3" | "1:1";

export type MediaProps = {
  /** Figma: `Kind`. */
  kind?: "image" | "video";
  /** Image or video URL. Without it, a tonal placeholder is shown. */
  src?: string;
  /** Required for images: describe what the image shows. */
  alt?: string;
  /** Figma: `Ratio`. The box reserves it, so there is no layout shift. */
  ratio?: MediaRatio;
  /** Figma: `Caption` (omit = showCaption off). */
  caption?: string;
  /** Video poster. */
  poster?: string;
  /** Load first: use on the page's main image (LCP). */
  priority?: boolean;
  /** Responsive sizes hint for next/image. */
  sizes?: string;
};

export function Media({ kind = "image", src, alt = "", ratio = "16:9", caption, poster, priority = false, sizes = "(min-width: 768px) 720px, 100vw" }: MediaProps) {
  return (
    <figure className={styles.media}>
      <div className={styles.frame} data-ratio={ratio}>
        {!src && (
          <span className={styles.placeholder} aria-hidden="true">
            <MediaImage />
          </span>
        )}
        {src && kind === "image" && <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={styles.image} />}
        {src && kind === "video" && <MediaVideo src={src} poster={poster} label={caption ?? alt} />}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
