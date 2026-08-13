"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import ModeSelector, { Mode } from "@/components/ModeSelector";
import ImageEditor from "@/components/ImageEditor";
import BuilderForm, { BuilderFormValues } from "@/components/BuilderForm";
import GenerationSequence from "@/components/GenerationSequence";
import ResultPanel from "@/components/ResultPanel";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { CropState, DEFAULT_CROP, loadImageFile, UnsupportedImageError } from "@/lib/imageUtils";
import { renderPfpFrame, renderBuilderCard, CARD_PHOTO_ASPECT } from "@/lib/canvasRender";
import { getBuilderTitle, getBuilderNumber, getCompositionVariant } from "@/lib/builderTitles";
import type { ShareData } from "@/lib/shareEncode";

type Step = "hero" | "mode" | "editor" | "form" | "generating" | "result";

export default function Page() {
  const [step, setStep] = useState<Step>("hero");
  const [mode, setMode] = useState<Mode>("pfp");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropState>(DEFAULT_CROP);
  const [form, setForm] = useState<BuilderFormValues>({ name: "", role: "", stack: "" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareData, setShareData] = useState<ShareData | null>(null);

  const scrollToCreate = useCallback(() => {
    document.getElementById("create")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  async function handleFile(file: File) {
    setError(null);
    try {
      const image = await loadImageFile(file);
      setImg(image);
      setCrop(DEFAULT_CROP);
      setStep("mode");
    } catch (err) {
      setError(err instanceof UnsupportedImageError ? err.message : "Something went wrong reading that photo.");
    }
  }

  function handleModeContinue() {
    setStep("editor");
  }

  function handleEditorContinue() {
    setStep(mode === "card" ? "form" : "generating");
  }

  function runGeneration() {
    if (!img) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mode === "pfp") {
      const builderNumber = getBuilderNumber(form.name || "guest", "pfp");
      renderPfpFrame(canvas, img, crop, builderNumber);
      setShareData({
        name: form.name || "Builder",
        role: "",
        stack: "",
        title: "HH GOA 2026",
        builderNumber,
        variant: "systems",
        mode: "pfp",
      });
    } else {
      const title = getBuilderTitle(form.role);
      const builderNumber = getBuilderNumber(form.name, form.role);
      const variant = getCompositionVariant(form.role);
      renderBuilderCard(canvas, img, crop, {
        name: form.name || "Builder",
        role: form.role || "Builder",
        stack: form.stack || "HH Goa 2026",
        title,
        builderNumber,
        variant,
      });
      setShareData({
        name: form.name || "Builder",
        role: form.role,
        stack: form.stack,
        title,
        builderNumber,
        variant,
        mode: "card",
      });
    }
    setStep("result");
  }

  function handleStartOver() {
    setImg(null);
    setCrop(DEFAULT_CROP);
    setForm({ name: "", role: "", stack: "" });
    setShareData(null);
    setError(null);
    setStep("hero");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink">
      <Hero onStart={scrollToCreate} />

      <section className="generator-shell relative py-28">
        <div className="mx-auto mb-12 max-w-4xl px-6 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[.3em] text-sun">Identity lab / now processing</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-paper sm:text-6xl">Make the internet look twice.</h2>
        </div>
        <AnimatePresence mode="wait">
          {step === "hero" && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UploadZone onFile={handleFile} error={error} />
            </motion.div>
          )}

          {step === "mode" && img && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">Choose a format</p>
              <ModeSelector value={mode} onChange={setMode} />
              <ContinueButton onClick={handleModeContinue} label="Continue" />
            </motion.div>
          )}

          {step === "editor" && img && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <ImageEditor
                img={img}
                aspect={mode === "pfp" ? 1 : CARD_PHOTO_ASPECT}
                crop={crop}
                onChange={setCrop}
                frameLabel={mode === "pfp" ? "PFP Frame preview" : "Card photo preview"}
              />
              <ContinueButton onClick={handleEditorContinue} label={mode === "card" ? "Continue" : "Generate my identity"} />
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <BuilderForm values={form} onChange={setForm} />
              <ContinueButton onClick={() => setStep("generating")} label="Generate my identity" disabled={!form.name.trim()} />
            </motion.div>
          )}

          {step === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GenerationSequence mode={mode} onDone={runGeneration} />
            </motion.div>
          )}

          {step === "result" && shareData && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultPanel
                canvasRef={canvasRef}
                filename={`hh-goa-2026-${mode}-${shareData.builderNumber}.png`}
                shareData={shareData}
                onStartOver={handleStartOver}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Off-screen canvas kept mounted so the ref exists before "result" renders it visibly */}
        {step !== "result" && <canvas ref={canvasRef} className="hidden" aria-hidden="true" />}
      </section>

      <HowItWorks />
      <Footer />
    </main>
  );
}

function ContinueButton({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-paper px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink transition-all hover:-translate-y-1 hover:bg-sun hover:shadow-[0_12px_40px_rgba(232,178,61,.2)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
    >
      {label}
    </button>
  );
}
