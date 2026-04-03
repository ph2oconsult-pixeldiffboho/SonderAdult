"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import styles from "./screens.module.css";

interface FirstEntryScreenProps {
  onComplete: () => void;
}

const SCREENS = [
  "It's already happening.",
  "You just haven't been watching it.",
  "It happened earlier today.",
  "What was it?",
];

enum FEStep {
  S0 = 0,
  S1 = 1,
  S2 = 2,
  S3 = 3,
}

export function FirstEntryScreen({ onComplete }: FirstEntryScreenProps) {
  const [step, setStep] = useState(FEStep.S0);
  const [ready, setReady] = useState(false);

  // Pacing: each screen holds before allowing tap
  useEffect(() => {
    setReady(false);
    // First screen holds longer — it's the threshold
    const hold = step === FEStep.S0 ? 3500 : 3000;
    const t = setTimeout(() => setReady(true), hold);
    return () => clearTimeout(t);
  }, [step]);

  const advance = useCallback(() => {
    if (!ready) return;
    if (step < FEStep.S3) {
      setStep((s) => s + 1);
    } else {
      // Last screen tapped — flow into the first session
      onComplete();
    }
  }, [ready, step, onComplete]);

  return (
    <div className={styles.screenWrap}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className={styles.firstEntryInner}
          onClick={advance}
        >
          <FadeIn delay={0.6} duration={1.2}>
            <p className={styles.firstEntryLine}>{SCREENS[step]}</p>
          </FadeIn>

          {ready && (
            <FadeIn delay={0}>
              <p className={styles.tapHint}>tap</p>
            </FadeIn>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
