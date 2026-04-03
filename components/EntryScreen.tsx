"use client";

import { useState, useEffect, useCallback } from "react";
import { FadeIn } from "./FadeIn";
import styles from "./screens.module.css";

interface EntryScreenProps {
  anchor?: string;
  entryLine: string;
  onBegin: () => void;
}

export function EntryScreen({ anchor, entryLine, onBegin }: EntryScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hold = anchor ? 3500 : 2500;
    const t = setTimeout(() => setReady(true), hold);
    return () => clearTimeout(t);
  }, [anchor]);

  const handleTap = useCallback(() => {
    if (ready) onBegin();
  }, [ready, onBegin]);

  return (
    <div className={styles.screenWrap} onClick={handleTap}>
      {anchor && (
        <FadeIn delay={0.5} duration={1.0}>
          <p className={styles.anchorLine}>{anchor}</p>
        </FadeIn>
      )}

      <FadeIn delay={anchor ? 2.0 : 0.8} duration={1.0}>
        <p className={styles.entryLine}>{entryLine}</p>
      </FadeIn>

      {ready && (
        <FadeIn delay={0}>
          <p className={styles.tapHint}>tap</p>
        </FadeIn>
      )}
    </div>
  );
}
