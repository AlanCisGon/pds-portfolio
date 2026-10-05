import styles from "./Divider.module.css";

/** 1 px border-subtle. Use sparingly: the brand separates by surface tone and space. */
export function Divider({
  orientation = "horizontal",
}: { orientation?: "horizontal" | "vertical" }) {
  if (orientation === "vertical") {
    return (
      <span
        className={styles.divider}
        data-orientation="vertical"
        role="separator"
        aria-orientation="vertical"
      />
    );
  }
  return <hr className={styles.divider} data-orientation="horizontal" />;
}
