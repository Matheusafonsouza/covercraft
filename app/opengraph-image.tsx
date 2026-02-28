import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a10",
          color: "#e8e6e1",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            padding: "28px 40px",
            borderRadius: 22,
            border: "1px solid #232334",
            background: "#11111b",
          }}
        >
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#7c3aed",
              color: "white",
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            ✦
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 62, fontWeight: 700, letterSpacing: -1 }}>
              CoverCraft
            </div>
            <div style={{ fontSize: 30, color: "#a7a3be", marginTop: 8 }}>
              Brand-matched cover letters
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
