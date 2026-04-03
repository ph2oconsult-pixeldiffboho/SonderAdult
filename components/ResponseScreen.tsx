"use client";

import { useState, useEffect, useCallback } from "react";
import { FadeIn } from "./FadeIn";
import styles from "./screens.module.css";

interface ResponseScreenProps {
  text: string;
  onContinue: () => void;
}

export function ResponseScreen({ text, onContinue }: ResponseScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleTap = useCallback(() => {
    if (ready) onContinue();
  }, [ready, onContinue]);

  return (
    <div className={styles.screenWrap} onClick={handleTap}>
      <FadeIn delay={0.4}>
        <p className={styles.responseLine}>{text}</p>
      </FadeIn>

      {ready && (
        <FadeIn delay={0}>
          <p className={styles.tapHint}>tap</p>
        </FadeIn>
      )}
    </div>
  );
}
