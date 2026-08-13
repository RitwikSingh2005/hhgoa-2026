"use client";

import { motion } from "framer-motion";

export type Mode = "pfp" | "card";

const OPTIONS: { mode: Mode; label: string; desc: string; tag: string }[] = [
  { mode: "pfp", label: "PFP Frame", desc: "A square HH Goa 2026 profile picture, ready for X.", tag: "01" },
  { mode: "card", label: "Builder Identity Card", desc: "Name, role, stack — a full collectible poster.", tag: "02" },
];

export default function ModeSelector({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 px-6 sm:grid-cols-2">
      {OPTIONS.map((opt) => {
        const active = value === opt.mode;
        return (
          <motion.button
            key={opt.mode}
            type="button"
            onClick={() => onChange(opt.mode)}
            whileTap={{ scale: 0.98 }}
            aria-pressed={active}
            className={`group relative flex flex-col gap-2 border px-5 py-6 text-left transition-colors ${
              active ? "border-sun bg-ink-soft" : "border-paper/25 hover:border-paper/50"
            }`}
          >
            <span className="font-mono text-[11px] text-paper/40">{opt.tag}</span>
            <span className="font-display text-xl text-paper">{opt.label}</span>
            <span className="font-body text-sm text-paper/60">{opt.desc}</span>
            {active && <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-sun" aria-hidden="true" />}
          </motion.button>
        );
      })}
    </div>
  );
}
