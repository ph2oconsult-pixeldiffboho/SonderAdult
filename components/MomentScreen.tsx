"use client";

import { useState, useEffect, useCallback } from "react";
import { FadeIn } from "./FadeIn";
import styles from "./screens.module.css";

interface MomentScreenProps {
  text: string;
  onContinue: () => void;
}

export function MomentScreen({ text, onContinue }: MomentScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleTap = useCallback(() => {
    if (ready) onContinue();
  }, [ready, onContinue]);

  return (
    <div className={styles.screenWrap} onClick={handleTap}>
      <FadeIn delay={0.3}>
        <p className={styles.momentLine}>{text}</p>
      </FadeIn>

      {ready && (
        <FadeIn delay={0}>
          <p className={styles.tapHint}>tap</p>
        </FadeIn>
      )}
    </div>
  );
}
