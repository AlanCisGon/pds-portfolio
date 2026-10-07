"use client";

import { Play } from "iconoir-react";
import { useRef, useState } from "react";
import styles from "./Media.module.css";

/** Video with a Cerezo play button (where people act). Native controls after start; no autoplay with sound. */
export function MediaVideo({
  src,
  poster,
  label,
  captions,
  captionsLabel = "English",
}: {
  src: string;
  poster?: string;
  label?: string;
  /** WebVTT captions URL. Required for any video with speech (WCAG 1.2.2). */
  captions?: string;
  /** Name of the captions track in the player menu. */
  captionsLabel?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  return (
    <>
      {/* biome-ignore lint/a11y/useMediaCaption: the track renders when `captions` is set; silent screen recordings need none (WCAG 1.2.2 applies to speech) */}
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls={started}
        preload="metadata"
        className={styles.image}
        aria-label={label}
      >
        {captions && (
          <track kind="captions" src={captions} srcLang="en" label={captionsLabel} default />
        )}
      </video>
      {!started && (
        <button
          type="button"
          className={styles.play}
          aria-label={label ? `Play video: ${label}` : "Play video"}
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
