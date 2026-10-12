import styles from "./HeroVisual.module.css";

/**
 * Abstract relief of cherry, titanium and aluminium, rendered in Blender
 * (scripts/blender/hero-veneer.py) as a seamless loop. Decorative: hidden from assistive tech.
 * With reduced motion the video is not shown and the poster stays.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`} aria-hidden="true">
      <video
        className={styles.video}
        src="/videos/hero-veneer.mp4"
        poster="/videos/hero-veneer-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
      />
    </div>
  );
}
