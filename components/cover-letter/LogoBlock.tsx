import React from "react";

interface LogoBlockProps {
  logoSrc?: string | null;
  logoW: number;
  logoH: number;
  tc: string;
  s: number;
}

export default function LogoBlock({
  logoSrc,
  logoW,
  logoH,
  tc,
  s,
}: LogoBlockProps) {
  return (
    <div
      style={{
        flexShrink: 0,
        marginBottom: Math.round(40 * s),
        lineHeight: 0,
      }}
    >
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt="Company logo"
          style={{
            width: logoW,
            height: logoH,
            objectFit: "contain",
            objectPosition: "left top",
            display: "block",
            userSelect: "none",
          }}
        />
      ) : (
        <div
          style={{
            width: logoW,
            height: Math.max(logoH, 32),
            border: `1.5px dashed ${tc}44`,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 10, color: tc, opacity: 0.3 }}>LOGO</span>
        </div>
      )}
    </div>
  );
}
