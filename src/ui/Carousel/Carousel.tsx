"use client";

import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import Image from "next/image";
import { type KeyboardEvent, useState } from "react";
import { IconButton } from "../IconButton";
import styles from "./Carousel.module.css";

export type CarouselProps = {
  images: Array<{ src: string; alt: string }>;
  /** Accessible name for the group, e.g. the case study name. */
  label: string;
};

/** Several images of a case. No autoplay; arrows on the keyboard; slides on its axis (fade with reduced motion). */
export function Carousel({ images, label }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (i: number) => setIndex((i + count) % count);
  const pad = (n: number) => String(n).padStart(2, "0");

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  };

  return (
    <section className={styles.carousel} aria-roledescription="carousel" aria-label={label}>
      <div className={styles.viewport} tabIndex={0} onKeyDown={onKey} aria-live="polite">
        <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((img, i) => (
            <div key={img.src} className={styles.slide} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 720px, 100vw" className={styles.image} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        <IconButton icon={<NavArrowLeft />} label="Previous" onClick={() => go(index - 1)} />
        <div className={styles.indicators}>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={styles.dot}
              data-active={i === index || undefined}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <IconButton icon={<NavArrowRight />} label="Next" onClick={() => go(index + 1)} />
      </div>
      <p className={styles.counter} aria-hidden="true">
        {pad(index + 1)} / {pad(count)}
      </p>
    </section>
  );
}
