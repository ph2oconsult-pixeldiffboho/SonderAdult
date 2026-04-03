"use client";

import { useState, useEffect, useCallback } from "react";
import { FadeIn } from "./FadeIn";
import styles from "./screens.module.css";

interface CloseScreenProps {
  text: string;
  onContinue: () => void;
}

export function CloseScreen({ text, onContinue }: CloseScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleTap = useCallback(() => {
    if (ready) onContinue();
  }, [ready, onContinue]);

  return (
    <div className={styles.screenWrap} onClick={handleTap}>
      <FadeIn delay={0.6} duration={1.2}>
        <p className={styles.closeLine}>{text}</p>
      </FadeIn>

      {ready && (
        <FadeIn delay={0}>
          <p className={styles.tapHint}>tap</p>
        </FadeIn>
      )}
    </div>
  );
}
