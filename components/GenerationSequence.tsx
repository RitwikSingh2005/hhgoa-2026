"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS_PFP = ["PHOTO INGESTED", "IDENTITY DETECTED", "HH GOA 2026 LAYER APPLIED", "FRAME GENERATED"];
const STEPS_CARD = ["PHOTO INGESTED", "IDENTITY DETECTED", "STACK MAPPED", "HH GOA 2026 LAYER APPLIED", "BUILDER ID GENERATED"];

export default function GenerationSequence({ mode, onDone }: { mode: "pfp" | "card"; onDone: () => void }) {
  const steps = mode === "pfp" ? STEPS_PFP : STEPS_CARD;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= steps.length) {
      const t = setTimeout(onDone, 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 180);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <div className="mx-auto flex min-h-[220px] w-full max-w-md flex-col items-center justify-center gap-3 px-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="font-mono text-sm uppercase tracking-[0.22em] text-sun"
        >
          {steps[Math.min(idx, steps.length - 1)]}
        </motion.p>
      </AnimatePresence>
      <div className="h-1 w-full max-w-xs overflow-hidden bg-paper/10">
        <motion.div
          className="h-full bg-laterite"
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(100, (idx / steps.length) * 100)}%` }}
          transition={{ duration: 0.18 }}
        />
      </div>
    </div>
  );
}
