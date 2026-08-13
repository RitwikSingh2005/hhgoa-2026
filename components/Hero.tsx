"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import FloatingFragments from "./FloatingFragments";

function MagneticCTA({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setPos({ x: relX * 0.25, y: relY * 0.25 });
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
      className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-paper px-7 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink shadow-[0_0_50px_rgba(232,178,61,.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sun"
    >
      <span className="absolute inset-0 translate-y-full bg-sun transition-transform duration-300 group-hover:translate-y-0" />
      <span className="relative">Create your identity</span>
      <ArrowDown className="relative h-4 w-4 transition-transform group-hover:translate-y-1" aria-hidden="true" />
    </motion.button>
  );
}

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="hero-mesh relative flex min-h-screen flex-col overflow-hidden px-5 pb-8 pt-5 sm:px-8 lg:px-12">
      <FloatingFragments />

      <nav className="relative z-30 flex items-center justify-between rounded-full border border-paper/10 bg-ink/60 px-4 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-sun text-ink"><Sparkles className="h-4 w-4" /></span>
          <span className="font-display text-sm tracking-tight text-paper">HH/GOA <span className="text-paper/35">’26</span></span>
        </div>
        <div className="hidden items-center gap-8 font-mono text-[9px] uppercase tracking-[.2em] text-paper/45 md:flex">
          <a href="#create" className="transition-colors hover:text-paper">Generator</a>
          <a href="#how" className="transition-colors hover:text-paper">How it works</a>
          <span className="flex items-center gap-2 text-emerald-300"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />System online</span>
        </div>
        <button onClick={onStart} className="group flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-paper">
          Start building <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </nav>

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 items-center py-16 lg:py-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-4">
        <div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-sun"
        >
          <span className="h-px w-8 bg-sun" /> Hackathon identity system / 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-[15vw] leading-[0.82] tracking-[-.065em] text-paper sm:text-[10vw] lg:text-[5.6vw] xl:text-[5.1vw]"
        >
          BUILD LOUD.
          <br /><span className="outline-text">LOOK ICONIC.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 max-w-xl"
        >
          <p className="font-body text-paper/70">
            One photo in. A scroll-stopping builder identity out. Crafted for the
            people turning caffeine, code and impossible ideas into something real.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-9 flex flex-wrap items-center gap-5"
        >
          <MagneticCTA onClick={onStart} />
          <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[.16em] text-paper/35">100% in-browser<br />Zero uploads</span>
        </motion.div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px] lg:max-w-none">
          <motion.div initial={{ opacity: 0, scale: .8, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: .15, type: "spring" }} className="identity-orbit absolute inset-[8%] rounded-full">
            <div className="absolute inset-[9%] rounded-full border border-paper/10" />
            <div className="absolute inset-[20%] rounded-full border border-dashed border-sun/30" />
            <div className="portal-core absolute inset-[28%] grid place-items-center rounded-full">
              <div className="text-center"><span className="font-display text-[clamp(3rem,7vw,7rem)] leading-none text-paper">26</span><p className="font-mono text-[8px] uppercase tracking-[.35em] text-paper/45">builder class</p></div>
            </div>
            <span className="orbit-chip orbit-chip-a">SHIP / REPEAT</span>
            <span className="orbit-chip orbit-chip-b">15.2993° N</span>
            <span className="orbit-chip orbit-chip-c">IDENTITY: LIVE</span>
          </motion.div>
        </div>
        </div>
      </div>

      <div className="relative z-20 -mx-5 overflow-hidden border-y border-paper/10 bg-paper/[.025] py-3 sm:-mx-8 lg:-mx-12">
        <div className="animate-marquee flex w-max whitespace-nowrap font-mono text-[9px] uppercase tracking-[.25em] text-paper/40">
          {[0,1].map(i => <span key={i}>NO LOGIN&nbsp;&nbsp; ✦ &nbsp;&nbsp;PRIVATE BY DESIGN&nbsp;&nbsp; ✦ &nbsp;&nbsp;REAL PNG EXPORT&nbsp;&nbsp; ✦ &nbsp;&nbsp;BUILT FOR BUILDERS&nbsp;&nbsp; ✦ &nbsp;&nbsp;GOA / INDIA&nbsp;&nbsp; ✦ &nbsp;&nbsp;</span>)}
        </div>
      </div>
    </section>
  );
}
