import type { CardVariant } from "./canvasRender";

export type ShareData = {
  name: string;
  role: string;
  stack: string;
  title: string;
  builderNumber: string;
  variant: CardVariant;
  mode: "pfp" | "card";
};

/** Card data is small (a few short strings) so we encode it directly into
 * the URL, base64url-encoded JSON. This lets /s/[data] and /api/og render
 * the correct OG image without any database or server storage. The user's
 * photo itself is not part of the share URL — only the exported PNG
 * (downloaded locally) contains it. */
export function encodeShareData(data: ShareData): string {
  const json = JSON.stringify(data);
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(json, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeShareData(token: string): ShareData | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    const json =
      typeof window === "undefined"
        ? Buffer.from(padded, "base64").toString("utf-8")
        : decodeURIComponent(escape(atob(padded)));
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || !parsed.name) return null;
    return parsed as ShareData;
  } catch {
    return null;
  }
}
