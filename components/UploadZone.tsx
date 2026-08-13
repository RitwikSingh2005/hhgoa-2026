"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";

const STATUS_SEQUENCE = ["PHOTO DETECTED", "ANALYZING IMAGE", "NORMALIZING ORIENTATION", "BUILDING IDENTITY"];

export default function UploadZone({
  onFile,
  error,
}: {
  onFile: (file: File) => void;
  error: string | null;
}) {
  const [dragging, setDragging] = useState(false);
  const [statusIdx, setStatusIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runStatusSequence = useCallback((file: File) => {
    setStatusIdx(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      if (i >= STATUS_SEQUENCE.length) {
        clearInterval(timer);
        onFile(file);
        setStatusIdx(null);
        return;
      }
      setStatusIdx(i);
    }, 260);
  }, [onFile]);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) runStatusSequence(file);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) runStatusSequence(file);
  }

  return (
    <div id="create" className="mx-auto w-full max-w-4xl px-6">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload your photo"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`upload-glow relative flex min-h-[380px] cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-[2rem] border bg-paper/[.035] px-8 py-16 text-center backdrop-blur-xl transition-all duration-500 ${
          dragging ? "scale-[1.01] border-sun bg-sun/[.06]" : "border-paper/10 hover:border-sun/50 hover:bg-paper/[.055]"
        }`}
      >
        <div className="pointer-events-none absolute inset-4 rounded-[1.4rem] border border-dashed border-paper/10" />
        <span className="absolute left-8 top-7 font-mono text-[9px] uppercase tracking-[.2em] text-paper/30">Input / 01</span>
        <span className="absolute right-8 top-7 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.2em] text-emerald-300/70"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Local only</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
          className="sr-only"
          onChange={handleSelect}
        />

        <AnimatePresence mode="wait">
          {statusIdx === null ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center gap-5"
            >
              <div className="upload-icon grid h-20 w-20 place-items-center rounded-full border border-paper/15 bg-paper/[.05]">
                <Upload className="h-7 w-7 text-sun" aria-hidden="true" />
              </div>
              <p className="font-display text-2xl tracking-tight text-paper sm:text-4xl">
                Drop your best shot.
              </p>
              <p className="max-w-md font-body text-sm text-paper/45">Drag it here or <span className="border-b border-sun/50 text-sun">browse your files</span>. We’ll turn it into your builder identity.</p>
              <div className="mt-2 flex gap-2 font-mono text-[8px] uppercase tracking-[.18em] text-paper/30"><span className="rounded-full border border-paper/10 px-3 py-1.5">JPG</span><span className="rounded-full border border-paper/10 px-3 py-1.5">PNG</span><span className="rounded-full border border-paper/10 px-3 py-1.5">HEIC</span></div>
            </motion.div>
          ) : (
            <motion.p
              key={statusIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-mono text-sm uppercase tracking-[0.2em] text-sun"
            >
              {STATUS_SEQUENCE[statusIdx]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p role="alert" className="mt-3 font-mono text-xs uppercase tracking-wide text-laterite-light">
          {error}
        </p>
      )}
    </div>
  );
}
