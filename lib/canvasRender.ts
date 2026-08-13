import { CropState, drawCropped } from "./imageUtils";

export const PFP_SIZE = 1024;
export const CARD_W = 1080;
export const CARD_H = 1350;
export const CARD_PHOTO_ASPECT = (CARD_W * 0.62) / (CARD_H * 0.52);

const PALETTE = {
  ink: "#0B1512",
  inkSoft: "#101F1A",
  paper: "#F3EEDD",
  paperDim: "#E7DFC6",
  laterite: "#B84A2A",
  lateriteDark: "#8F3A21",
  foliage: "#3E6B4E",
  ocean: "#1D4E5E",
  sun: "#E8B23D",
};

const GOA_COORDS = "LAT 15.2993 N / LON 74.1240 E";

export type CardVariant = "grid" | "data" | "editorial" | "systems";

export type BuilderCardData = {
  name: string;
  role: string;
  stack: string;
  title: string;
  builderNumber: string;
  variant: CardVariant;
};

function drawGrain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  const dotSize = 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#000000";
  for (let i = 0; i < (w * h) / 900; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillRect(x, y, dotSize, dotSize);
  }
  ctx.restore();
}

function drawDashedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  lineWidth = 2,
  dash: number[] = [6, 5]
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(dash);
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function drawRegistrationMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.moveTo(cx - r - 4, cy);
  ctx.lineTo(cx + r + 4, cy);
  ctx.moveTo(cx, cy - r - 4);
  ctx.lineTo(cx, cy + r + 4);
  ctx.stroke();
  ctx.restore();
}

function drawRotatedLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  angleDeg: number,
  color: string,
  size: number,
  letterSpacing = 2
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.fillStyle = color;
  ctx.font = `${size}px var(--font-mono), monospace`;
  ctx.textBaseline = "middle";
  let cursor = 0;
  for (const ch of text) {
    ctx.fillText(ch, cursor, 0);
    cursor += ctx.measureText(ch).width + letterSpacing;
  }
  ctx.restore();
}

function haloText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  fill: string
) {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

/** Renders the HH GOA 2026 profile-picture frame. Photo stays dominant and
 * centered; decoration lives strictly in the margins and corners. */
export function renderPfpFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  crop: CropState,
  builderNumber: string
) {
  canvas.width = PFP_SIZE;
  canvas.height = PFP_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const S = PFP_SIZE;

  // Background frame color
  ctx.fillStyle = PALETTE.ink;
  ctx.fillRect(0, 0, S, S);

  // Photo, inset with a margin so the frame reads clearly on tiny avatars
  const margin = S * 0.055;
  drawCropped(ctx, img, crop, margin, margin, S - margin * 2, S - margin * 2);

  // Corner triangle — laterite accent, asymmetric (bottom-right only)
  ctx.save();
  ctx.fillStyle = PALETTE.laterite;
  ctx.beginPath();
  ctx.moveTo(S, S);
  ctx.lineTo(S - S * 0.22, S);
  ctx.lineTo(S, S - S * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Outer dashed registration border
  drawDashedRect(ctx, margin * 0.4, margin * 0.4, S - margin * 0.8, S - margin * 0.8, PALETTE.paper, 2.5, [10, 7]);

  // Registration marks, top-left & bottom-right
  drawRegistrationMark(ctx, margin * 0.4, margin * 0.4, 6, PALETTE.sun);
  drawRegistrationMark(ctx, S - margin * 0.4, S - margin * 0.4, 6, PALETTE.paper);

  // Top strip: event mark
  ctx.save();
  ctx.fillStyle = PALETTE.paper;
  ctx.font = `700 ${S * 0.036}px var(--font-mono), monospace`;
  ctx.textBaseline = "top";
  ctx.fillText("HH GOA 2026", margin * 1.1, margin * 1.1);
  ctx.restore();

  // Bottom-left builder number stamp
  ctx.save();
  ctx.strokeStyle = PALETTE.sun;
  ctx.lineWidth = 2;
  const stampW = S * 0.34;
  const stampH = S * 0.09;
  const sx = margin * 1.1;
  const sy = S - margin * 1.1 - stampH;
  ctx.strokeRect(sx, sy, stampW, stampH);
  ctx.fillStyle = PALETTE.sun;
  ctx.font = `${S * 0.026}px var(--font-mono), monospace`;
  ctx.textBaseline = "middle";
  ctx.fillText(`BUILDER_${builderNumber}`, sx + 10, sy + stampH / 2);
  ctx.restore();

  drawGrain(ctx, S, S, 0.02);
}

/** Renders the Builder Identity Card poster (1080x1350). Layout accents
 * shift slightly per `variant`, keeping the same brand system throughout. */
export function renderBuilderCard(canvas: HTMLCanvasElement, img: HTMLImageElement, crop: CropState, data: BuilderCardData) {
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = CARD_W;
  const H = CARD_H;

  const accent =
    data.variant === "grid" ? PALETTE.ocean : data.variant === "data" ? PALETTE.foliage : data.variant === "editorial" ? PALETTE.laterite : PALETTE.laterite;

  // Base paper
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, W, H);

  // Ink header band
  const headerH = H * 0.09;
  ctx.fillStyle = PALETTE.ink;
  ctx.fillRect(0, 0, W, headerH);
  ctx.fillStyle = PALETTE.paper;
  ctx.font = `700 30px var(--font-mono), monospace`;
  ctx.textBaseline = "middle";
  ctx.fillText("HH GOA 2026", 36, headerH / 2);
  ctx.textAlign = "right";
  ctx.font = `20px var(--font-mono), monospace`;
  ctx.fillStyle = PALETTE.sun;
  ctx.fillText(GOA_COORDS, W - 36, headerH / 2);
  ctx.textAlign = "left";

  // Photo block — asymmetric bleed, occupies top-left 62% width block
  const photoX = 0;
  const photoY = headerH;
  const photoW = W * 0.62;
  const photoH = H * 0.52;
  drawCropped(ctx, img, crop, photoX, photoY, photoW, photoH);

  // Halftone/duotone treatment over the photo (ink-tinted multiply dots)
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = accent;
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.restore();
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.5;
  const dotGap = 5;
  ctx.fillStyle = PALETTE.ink;
  for (let y = photoY; y < photoY + photoH; y += dotGap) {
    for (let x = photoX; x < photoX + photoW; x += dotGap) {
      if ((x + y) % (dotGap * 2) === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();

  // Right-hand metadata column beside the photo
  const colX = photoW + 28;
  const colW = W - colX - 28;
  let cy = photoY + 34;
  ctx.fillStyle = PALETTE.ink;
  const metaRows: [string, string][] = [
    ["STATUS", "BUILDING"],
    ["EVENT", "HH GOA 2026"],
    ["LOCATION", "GOA, INDIA"],
    ["ID", `BUILDER_${data.builderNumber}`],
  ];
  for (const [label, value] of metaRows) {
    ctx.font = `12px var(--font-mono), monospace`;
    ctx.fillStyle = accent;
    ctx.fillText(label, colX, cy);
    cy += 20;
    ctx.font = `700 15px var(--font-mono), monospace`;
    ctx.fillStyle = PALETTE.ink;
    wrapText(ctx, value, colX, cy, colW, 18);
    cy += 40;
  }

  // Dashed divider under the photo block
  drawDashedRect(ctx, 0, photoY, W, photoH, "transparent", 0);
  ctx.save();
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 6]);
  ctx.beginPath();
  ctx.moveTo(0, photoY + photoH);
  ctx.lineTo(W, photoY + photoH);
  ctx.stroke();
  ctx.restore();

  // Builder title band (rotated stamp, sits over the seam)
  ctx.save();
  ctx.translate(W - 210, photoY + photoH);
  ctx.rotate((-6 * Math.PI) / 180);
  ctx.fillStyle = accent;
  const titleW = Math.max(200, ctx.measureText(data.title).width + 40);
  ctx.fillRect(-titleW / 2, -22, titleW, 44);
  ctx.fillStyle = PALETTE.paper;
  ctx.font = `700 18px var(--font-mono), monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(data.title, 0, 1);
  ctx.textAlign = "left";
  ctx.restore();

  // Name — oversized display type, the dominant element of the lower half
  let nameY = photoY + photoH + 96;
  ctx.fillStyle = PALETTE.ink;
  const nameSize = fitFontSize(ctx, data.name.toUpperCase(), W - 72, 78, "var(--font-display)");
  ctx.font = `${nameSize}px var(--font-display), sans-serif`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(data.name.toUpperCase(), 36, nameY);

  // Role / stack line
  nameY += 46;
  ctx.font = `18px var(--font-mono), monospace`;
  ctx.fillStyle = PALETTE.laterite;
  ctx.fillText(`${data.role.toUpperCase()}  //  ${data.stack.toUpperCase()}`, 36, nameY);

  // Footer strip
  const footerY = H - 64;
  ctx.save();
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(36, footerY - 20);
  ctx.lineTo(W - 36, footerY - 20);
  ctx.stroke();
  ctx.restore();
  ctx.font = `13px var(--font-mono), monospace`;
  ctx.fillStyle = PALETTE.ink;
  ctx.fillText("SEE YOU AT HH GOA 2026", 36, footerY);
  ctx.textAlign = "right";
  ctx.fillText(GOA_COORDS, W - 36, footerY);
  ctx.textAlign = "left";

  // Registration marks + outer dashed border, poster-frame feel
  drawDashedRect(ctx, 14, headerH + 14, W - 28, H - headerH - 28, PALETTE.ink, 1.5, [8, 6]);
  drawRegistrationMark(ctx, 14, headerH + 14, 5, accent);
  drawRegistrationMark(ctx, W - 14, H - 14, 5, accent);

  drawGrain(ctx, W, H, 0.03);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

function fitFontSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, fontFamily: string): number {
  let size = startSize;
  while (size > 24) {
    ctx.font = `${size}px ${fontFamily}, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}
