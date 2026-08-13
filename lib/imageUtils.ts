export type CropState = {
  /**
   * Offset of the image center from the crop-frame center, expressed as a
   * FRACTION of the frame's width/height (not raw pixels). This is what
   * makes a crop chosen in the small on-screen editor (e.g. a 320px
   * preview) reproduce correctly when the same CropState is later applied
   * to a much larger export canvas (e.g. 1024px or 1080px) — as long as
   * both frames share the same aspect ratio, the fraction is scale-free.
   */
  offsetX: number;
  offsetY: number;
  /** Zoom multiplier applied on top of the base "cover" scale. */
  zoom: number;
};

export const DEFAULT_CROP: CropState = { offsetX: 0, offsetY: 0, zoom: 1 };

export const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"];

export class UnsupportedImageError extends Error {}

/**
 * Loads a user-supplied image file into an HTMLImageElement, auto-correcting
 * EXIF orientation where the browser supports it (createImageBitmap with
 * imageOrientation: "from-image", supported in all evergreen browsers).
 *
 * HEIC/HEIF: most non-Safari browsers cannot decode these in-canvas. We try,
 * and surface a clear UnsupportedImageError so the UI can ask for a JPG/PNG
 * instead of silently failing.
 */
export async function loadImageFile(file: File): Promise<HTMLImageElement> {
  const isHeic =
    /heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new UnsupportedImageError("Canvas context unavailable.");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    await img.decode();
    return img;
  } catch (err) {
    if (isHeic) {
      throw new UnsupportedImageError(
        "This browser can't read HEIC photos. Please export as JPG or PNG and try again."
      );
    }
    throw new UnsupportedImageError("Couldn't read that image. Try a JPG or PNG.");
  }
}

/** "Cover" scale so the image fully fills a targetW x targetH frame. */
export function coverScale(imgW: number, imgH: number, targetW: number, targetH: number): number {
  return Math.max(targetW / imgW, targetH / imgH);
}

/** Clamps offsets (fractions of destW/destH) so the image always fully
 * covers the frame — works the same regardless of destW/destH's absolute
 * size, only their aspect ratio matters relative to the source image. */
export function clampOffset(
  crop: CropState,
  imgW: number,
  imgH: number,
  targetW: number,
  targetH: number
): CropState {
  const base = coverScale(imgW, imgH, targetW, targetH);
  const scale = base * crop.zoom;
  const scaledW = imgW * scale;
  const scaledH = imgH * scale;
  const maxXFrac = Math.max(0, (scaledW - targetW) / 2 / targetW);
  const maxYFrac = Math.max(0, (scaledH - targetH) / 2 / targetH);
  return {
    zoom: crop.zoom,
    offsetX: Math.min(maxXFrac, Math.max(-maxXFrac, crop.offsetX)),
    offsetY: Math.min(maxYFrac, Math.max(-maxYFrac, crop.offsetY)),
  };
}

/**
 * Draws an image into a target rectangle of a canvas context, applying
 * "cover" fit plus the user's zoom/offset crop adjustments. `crop.offsetX/Y`
 * are fractions of destW/destH, so the same CropState reproduces identically
 * whether destW/destH is a small editor preview or a large export canvas.
 */
export function drawCropped(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  crop: CropState,
  destX: number,
  destY: number,
  destW: number,
  destH: number
) {
  const base = coverScale(img.width, img.height, destW, destH);
  const scale = base * crop.zoom;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const cx = destX + destW / 2 - crop.offsetX * destW;
  const cy = destY + destH / 2 - crop.offsetY * destH;

  ctx.save();
  ctx.beginPath();
  ctx.rect(destX, destY, destW, destH);
  ctx.clip();
  ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  ctx.restore();
}
