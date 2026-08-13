"use client";

import { useRef, useState, useCallback } from "react";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CropState, DEFAULT_CROP, clampOffset, drawCropped } from "@/lib/imageUtils";

export default function ImageEditor({
  img,
  aspect,
  crop,
  onChange,
  frameLabel,
}: {
  img: HTMLImageElement;
  /** width / height of the target frame */
  aspect: number;
  crop: CropState;
  onChange: (c: CropState) => void;
  frameLabel: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startY: number; origin: CropState } | null>(null);
  const [dragging, setDragging] = useState(false);

  const frameW = 320;
  const frameH = frameW / aspect;

  const applyChange = useCallback(
    (next: CropState) => {
      onChange(clampOffset(next, img.width, img.height, frameW, frameH));
    },
    [img.width, img.height, frameW, frameH, onChange]
  );

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, origin: crop };
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    applyChange({
      zoom: dragState.current.origin.zoom,
      offsetX: dragState.current.origin.offsetX - dx / frameW,
      offsetY: dragState.current.origin.offsetY - dy / frameH,
    });
  }

  function handlePointerUp() {
    dragState.current = null;
    setDragging(false);
  }

  function handleZoom(delta: number) {
    const nextZoom = Math.min(3, Math.max(1, crop.zoom + delta));
    applyChange({ ...crop, zoom: nextZoom });
  }

  function handleReset() {
    onChange(clampOffset(DEFAULT_CROP, img.width, img.height, frameW, frameH));
  }

  // Live preview via a small canvas kept in sync through a ref callback
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const setPreviewRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      previewRef.current = node;
      if (!node) return;
      node.width = frameW;
      node.height = frameH;
      const ctx = node.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, frameW, frameH);
      drawCropped(ctx, img, crop, 0, 0, frameW, frameH);
    },
    [img, crop, frameW, frameH]
  );

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">{frameLabel}</p>

      <div
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`reg-border relative touch-none select-none overflow-hidden bg-ink-soft ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ width: frameW, height: frameH }}
        role="group"
        aria-label="Drag to reposition your photo, use the zoom controls to adjust scale"
      >
        <canvas ref={setPreviewRef} width={frameW} height={frameH} className="pointer-events-none block h-full w-full" />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleZoom(-0.15)}
          aria-label="Zoom out"
          className="rounded-full border border-paper/30 p-2 text-paper transition-colors hover:border-sun hover:text-sun"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={crop.zoom}
          onChange={(e) => applyChange({ ...crop, zoom: parseFloat(e.target.value) })}
          aria-label="Zoom level"
          className="h-1 w-32 accent-laterite"
        />
        <button
          type="button"
          onClick={() => handleZoom(0.15)}
          aria-label="Zoom in"
          className="rounded-full border border-paper/30 p-2 text-paper transition-colors hover:border-sun hover:text-sun"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset crop"
          className="ml-2 flex items-center gap-1 rounded-full border border-paper/30 px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-paper transition-colors hover:border-sun hover:text-sun"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}
