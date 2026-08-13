"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

const STEPS = [
  { n: "01", title: "Drop your photo", desc: "JPG, PNG or HEIC. It never leaves your device." },
  { n: "02", title: "Reposition & zoom", desc: "A simple crop editor — no confusion, no Photoshop." },
  { n: "03", title: "Pick a format", desc: "PFP frame for X, or a full Builder Identity Card." },
  { n: "04", title: "Download & ship it", desc: "Real PNG export, plus a link that unfurls on X." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-paper/10 px-6 py-28 sm:px-10 md:px-16">
      <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="font-mono text-[9px] uppercase tracking-[0.3em] text-sun">Four moves. That’s it.</p><h2 className="mt-4 max-w-3xl font-display text-4xl leading-[.95] tracking-tight text-paper sm:text-6xl">From camera roll<br/>to cult status.</h2></div>
        <p className="max-w-sm text-sm leading-relaxed text-paper/40">No design degree. No mysterious cloud upload. Just a tiny creative machine living inside your browser.</p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div key={s.n} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:.3}} transition={{delay:i*.08}} whileHover={{y:-8}} className="group relative min-h-[260px] overflow-hidden rounded-[1.5rem] border border-paper/10 bg-paper/[.03] p-6 transition-colors hover:border-sun/30 hover:bg-paper/[.06]">
            <span className="font-mono text-[10px] text-sun">/{s.n}</span>
            <ArrowDownRight className="absolute right-6 top-6 h-5 w-5 text-paper/20 transition-all group-hover:rotate-45 group-hover:text-sun" />
            <div className="absolute bottom-6 left-6 right-6"><h3 className="font-display text-2xl tracking-tight text-paper">{s.title}</h3><p className="mt-3 text-sm leading-relaxed text-paper/40">{s.desc}</p></div>
            <span className="absolute -right-4 -top-6 font-display text-[8rem] leading-none text-paper/[.025]">{s.n}</span>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
