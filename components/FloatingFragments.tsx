"use client";

import { motion } from "framer-motion";

type Fragment = {
  text: string;
  top: string;
  left: string;
  rotate: number;
  delay: number;
  size: string;
  color: string;
};

const FRAGMENTS: Fragment[] = [
  { text: "HH GOA 2026", top: "10%", left: "6%", rotate: -8, delay: 0, size: "text-xs", color: "text-paper/40" },
  { text: "BUILDERS", top: "22%", left: "82%", rotate: 5, delay: 0.6, size: "text-xs", color: "text-sun/50" },
  { text: "SHIP IT", top: "68%", left: "88%", rotate: -4, delay: 1.1, size: "text-xs", color: "text-paper/40" },
  { text: "STACK: JAVA", top: "78%", left: "8%", rotate: 6, delay: 0.3, size: "text-xs", color: "text-laterite/60" },
  { text: "STATUS: BUILDING", top: "40%", left: "3%", rotate: -3, delay: 0.9, size: "text-xs", color: "text-foliage/60" },
  { text: "GOA / INDIA", top: "88%", left: "58%", rotate: 3, delay: 0.2, size: "text-xs", color: "text-paper/40" },
  { text: "PUSH TO PROD", top: "6%", left: "62%", rotate: 4, delay: 1.4, size: "text-xs", color: "text-paper/30" },
];

export default function FloatingFragments() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FRAGMENTS.map((f, i) => (
        <motion.span
          key={i}
          className={`absolute font-mono uppercase tracking-[0.18em] ${f.size} ${f.color}`}
          style={{ top: f.top, left: f.left, ["--r" as string]: `${f.rotate}deg` } as React.CSSProperties}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: f.delay, duration: 1 }}
        >
          <motion.span
            className="inline-block animate-float"
            style={{ animationDelay: `${f.delay}s` }}
          >
            {f.text}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}
