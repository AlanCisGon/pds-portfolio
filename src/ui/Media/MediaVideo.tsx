"use client";

import { Play } from "iconoir-react";
import { useRef, useState } from "react";
import styles from "./Media.module.css";

/** Video with a Cerezo play button (where the hand goes). Native controls after start; no autoplay with sound. */
export function MediaVideo({ src, poster, label }: { src: string; poster?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  return (
    <>
      <video ref={ref} src={src} poster={poster} controls={started} preload="metadata" className={styles.image} aria-label={label} />
      {!started && (
        <button
          type="button"
          className={styles.play}
          aria-label={label ? `Reproducir video: ${label}` : "Reproducir video"}
          onClick={() => {
            setStarted(true);
            void ref.current?.play();
          }}
        >
          <span className={styles.playIcon} aria-hidden="true">
            <Play />
          </span>
        </button>
      )}
    </>
  );
}
