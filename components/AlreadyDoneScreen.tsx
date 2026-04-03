"use client";

import { FadeIn } from "./FadeIn";
import styles from "./screens.module.css";

export function AlreadyDoneScreen() {
  return (
    <div className={styles.screenWrap}>
      <FadeIn delay={0.3}>
        <div className={styles.doneDot} />
      </FadeIn>

      <FadeIn delay={1.0}>
        <p className={styles.alreadyDone}>Tomorrow.</p>
      </FadeIn>
    </div>
  );
}
