"use client";

import { FadeIn } from "./FadeIn";
import styles from "./screens.module.css";

export function DoneScreen() {
  return (
    <div className={styles.screenWrap}>
      <FadeIn delay={0.3}>
        <div className={styles.doneDot} />
      </FadeIn>

      <FadeIn delay={1.3} duration={1.8}>
        <p className={styles.doneLine}>You'll see it again.</p>
      </FadeIn>
    </div>
  );
}
