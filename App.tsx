/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export default function App() {
  const [index, setIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const touchStart = useRef<number | null>(null);

  const handleBegin = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    // 300ms fade + 500ms hold = 800ms total
    setTimeout(() => {
      window.location.href = "https://sonder-adult.vercel.app/?entry=landing";
    }, 800);
  }, [isExiting]);

  const SCREENS = useMemo(() => [
    { id: 1, content: <h1 className="text-4xl md:text-6xl font-light tracking-tight">It’s already happening.</h1> },
    { id: 2, content: <h2 className="text-4xl md:text-6xl font-light tracking-tight">You just haven’t been watching it.</h2> },
    { id: 3, content: <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">You’ll see it.<br />Then you’ll recognise it.</h2> },
    { id: 4, content: (
      <div className="space-y-20">
        <div className="space-y-10">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
            One pattern. Seven days.
          </h2>
          <p className="text-lg md:text-2xl font-light tracking-wide text-sonder-text/65">
            Less than a minute.<br />
            You’ll notice it later.
          </p>
        </div>
        <motion.button
          onClick={handleBegin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          whileHover={{ opacity: 0.8, borderColor: "rgba(224, 224, 229, 0.6)" }}
          whileTap={{ scale: 0.99, opacity: 0.6 }}
          className="px-10 py-4 border border-sonder-text/35 hover:border-sonder-text/60 transition-all duration-1000 text-xs tracking-[0.4em] uppercase font-light cursor-pointer"
        >
          Begin the 7 days
        </motion.button>
      </div>
    )},
  ], [handleBegin]);

  const handleNext = useCallback(() => {
    if (isLocked || index >= SCREENS.length - 1 || isExiting) return;
    const nextIndex = index + 1;
    setIndex(nextIndex);
    lockScroll(nextIndex);
  }, [index, isLocked, isExiting, SCREENS.length]);

  const handlePrev = useCallback(() => {
    if (isLocked || index <= 0 || isExiting) return;
    const nextIndex = index - 1;
    setIndex(nextIndex);
    lockScroll(nextIndex);
  }, [index, isLocked, isExiting]);

  const lockScroll = (nextIndex: number) => {
    setIsLocked(true);
    setIsTransitioning(true);
    // Extend lock on final screen
    const duration = nextIndex === SCREENS.length - 1 ? 1800 : 1200;
    setTimeout(() => {
      setIsLocked(false);
    }, duration);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return; // Ignore small scrolls
      if (e.deltaY > 0) handleNext();
      else handlePrev();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart.current === null) return;
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart.current - touchEnd;
      if (Math.abs(diff) > 50) {
        if (diff > 0) handleNext();
        else handlePrev();
      }
      touchStart.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleNext, handlePrev]);

  return (
    <main className="h-screen w-full bg-sonder-bg text-sonder-text overflow-hidden relative">
      <motion.div
        animate={{ y: `-${index * 100}vh` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => setIsTransitioning(false)}
        className="h-full w-full"
      >
        {SCREENS.map((screen, i) => (
          <section
            key={screen.id}
            className="h-screen w-full flex flex-col items-center justify-center px-8 text-center"
          >
            <AnimatePresence mode="wait">
              {index === i && !isTransitioning && (
                <motion.div
                  initial={{ opacity: 0, y: 1 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {screen.content}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        ))}
      </motion.div>

      {/* Subtle atmospheric texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.01] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Exit Overlay */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#0b0b0f] z-[100] pointer-events-auto"
          />
        )}
      </AnimatePresence>
    </main>
  );
}
