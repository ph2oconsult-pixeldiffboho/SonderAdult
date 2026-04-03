"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import type { Transition } from "@/lib/content";
import styles from "./screens.module.css";

interface TransitionScreenProps {
  transition: Transition;
  onBegin: () => void;
  onDecline: () => void;
}

enum TStep {
  SCREEN1 = 0,
  SCREEN2 = 1,
  SCREEN3 = 2,
}

export function TransitionScreen({
  transition,
  onBegin,
  onDecline,
}: TransitionScreenProps) {
  const [step, setStep] = useState(TStep.SCREEN1);
  const [ready, setReady] = useState(false);

  // Pacing: hold each screen before allowing progression
  useEffect(() => {
    setReady(false);
    const hold = step === TStep.SCREEN3 ? 2000 : 3500;
    const t = setTimeout(() => setReady(true), hold);
    return () => clearTimeout(t);
  }, [step]);

  const advance = useCallback(() => {
    if (!ready) return;
    if (step < TStep.SCREEN3) {
      setStep((s) => s + 1);
    }
  }, [ready, step]);

  return (
    <div className={styles.screenWrap}>
      <AnimatePresence mode="wait">
        {step === TStep.SCREEN1 && (
          <motion.div
            key="t1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.transitionInner}
            onClick={advance}
          >
            <FadeIn delay={0.5} duration={1.0}>
              <p className={styles.transitionLine}>{transition.screen1}</p>
            </FadeIn>
            {ready && (
              <FadeIn delay={0}>
                <p className={styles.tapHint}>tap</p>
              </FadeIn>
            )}
          </motion.div>
        )}

        {step === TStep.SCREEN2 && (
          <motion.div
            key="t2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.transitionInner}
            onClick={advance}
          >
            <FadeIn delay={0.5} duration={1.0}>
              <p className={styles.transitionLine}>{transition.screen2}</p>
            </FadeIn>
            {ready && (
              <FadeIn delay={0}>
                <p className={styles.tapHint}>tap</p>
              </FadeIn>
            )}
          </motion.div>
        )}

        {step === TStep.SCREEN3 && (
          <motion.div
            key="t3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.transitionInner}
          >
            <FadeIn delay={0.4} duration={0.8}>
              <p className={styles.transitionCommit}>{transition.screen3}</p>
            </FadeIn>
            {ready && (
              <FadeIn delay={0}>
                <div className={styles.transitionButtons}>
                  <button
                    className={styles.primaryBtn}
                    onClick={onBegin}
                  >
                    {transition.primaryCta}
                  </button>
                  <button
                    className={styles.secondaryBtn}
                    onClick={onDecline}
                  >
                    {transition.secondaryCta}
                  </button>
                </div>
              </FadeIn>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
