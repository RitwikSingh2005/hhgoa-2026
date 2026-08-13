"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, RefreshCcw, Link as LinkIcon, Check } from "lucide-react";
import type { RefObject } from "react";
import { encodeShareData, ShareData } from "@/lib/shareEncode";

const SITE_URL = "https://hhgoa2026-identity.vercel.app";

export default function ResultPanel({
  canvasRef,
  filename,
  shareData,
  onStartOver,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
  filename: string;
  shareData: ShareData;
  onStartOver: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    const token = encodeShareData(shareData);
    return `${SITE_URL}/s/${token}`;
  }, [shareData]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  }

  function handleShareX() {
    const text = encodeURIComponent(
      `I just built my HH Goa 2026 identity as a ${shareData.title}. ${shareUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — silently ignore, link is still visible
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-6"
    >
      <div className="reg-border overflow-hidden bg-ink-soft p-2">
        <canvas ref={canvasRef} className="block h-auto max-h-[70vh] w-auto max-w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-laterite px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-sun hover:text-ink"
        >
          <Download className="h-4 w-4" /> Download
        </button>
        <button
          onClick={handleShareX}
          className="flex items-center gap-2 border border-paper/30 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:border-sun hover:text-sun"
        >
          Share to X
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 border border-paper/30 px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper/70 transition-colors hover:border-sun hover:text-sun"
          aria-label="Copy share link"
        >
          {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      <button
        onClick={onStartOver}
        className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40 transition-colors hover:text-paper"
      >
        <RefreshCcw className="h-3.5 w-3.5" /> Start over
      </button>
    </motion.div>
  );
}
