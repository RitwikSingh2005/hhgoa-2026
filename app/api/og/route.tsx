import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const PALETTE = {
  ink: "#0B1512",
  paper: "#F3EEDD",
  laterite: "#B84A2A",
  sun: "#E8B23D",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") || "").slice(0, 40) || "BUILDER";
  const title = (searchParams.get("title") || "HH GOA 2026").slice(0, 40);
  const role = (searchParams.get("role") || "").slice(0, 40);
  const id = (searchParams.get("id") || "000000").slice(0, 6);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PALETTE.paper,
          padding: "56px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 20,
            border: `2px dashed ${PALETTE.ink}`,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: PALETTE.ink }}>
          <span>HH GOA 2026</span>
          <span style={{ color: PALETTE.laterite }}>LAT 15.2993 / LON 74.1240</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              backgroundColor: PALETTE.laterite,
              color: PALETTE.paper,
              padding: "10px 22px",
              fontSize: 24,
              transform: "rotate(-4deg)",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 900, color: PALETTE.ink, lineHeight: 1 }}>
            {name.toUpperCase()}
          </div>
          {role && (
            <div style={{ display: "flex", fontSize: 28, color: PALETTE.laterite }}>{role.toUpperCase()}</div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: PALETTE.ink }}>
          <span>BUILDER_{id}</span>
          <span>SEE YOU AT HH GOA 2026</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
