"use client";

import React from "react";
import { CardData } from "@/lib/types";
import { startDrag } from "@/lib/drag";

const SCALE = 0.6; // must match Preview component

interface Props {
  data: CardData;
  bg: string;
  tc: string;
  logoW: number;
  logoH: number;
  cardW: number;
  cardH: number;
  onCardResize: (w: number, h: number) => void;
  handles: boolean;
  forwardedRef: React.RefObject<HTMLDivElement>;
}

const Grip = ({ size = 13, color = "rgba(255,255,255,0.7)" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12 12">
    {([[4,8],[8,4],[8,8],[12,4],[12,8],[12,12]] as [number,number][]).map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="1.5" fill={color} />
    ))}
  </svg>
);

export default function CoverLetterCard({
  data, bg, tc, logoW, logoH, cardW, cardH, onCardResize, handles, forwardedRef,
}: Props) {
  const s = cardW / 595; // proportional scale for typography
  const paragraphs = (data.body || "").split("\n").map(p => p.trim()).filter(Boolean);

  const onCardHandleDown = (e: React.MouseEvent) => {
    const sw = cardW, sh = cardH;
    startDrag(e, (cx, cy) => {
      const dx = (cx - e.clientX) / SCALE;
      const dy = (cy - e.clientY) / SCALE;
      onCardResize(Math.max(300, sw + dx), Math.max(400, sh + dy));
    });
  };

  return (
    <div style={{ position: "relative", display: "inline-block", lineHeight: 0 }}>
      {/* ── Letter surface ── */}
      <div
        ref={forwardedRef}
        style={{
          width: cardW,
          height: cardH,
          background: bg,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          color: tc,
          overflow: "hidden",
          padding: `${Math.round(52 * s)}px ${Math.round(56 * s)}px ${Math.round(44 * s)}px`,
          transition: "background 0.3s",
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0, marginBottom: Math.round(40 * s), lineHeight: 0 }}>
          {data.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.logoSrc}
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

        {/* Job title */}
        <h1
          style={{
            fontSize: Math.round(22 * s),
            fontWeight: 700,
            color: tc,
            marginBottom: Math.round(24 * s),
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            flexShrink: 0,
          }}
        >
          {data.jobTitle || "Job Title"}
        </h1>

        {/* Body */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: Math.round(13.5 * s * 10) / 10,
                  lineHeight: 1.75,
                  color: tc,
                  marginBottom: Math.round(16 * s),
                  opacity: 0.92,
                  textAlign: "justify",
                }}
              >
                {p}
              </p>
            ))
          ) : (
            <p style={{ fontSize: Math.round(13 * s), opacity: 0.25, fontStyle: "italic", color: tc }}>
              Your cover letter text will appear here…
            </p>
          )}
        </div>

        {/* Separator */}
        <div
          style={{
            width: Math.round(32 * s),
            height: 2,
            background: tc,
            opacity: 0.35,
            marginTop: Math.round(24 * s),
            marginBottom: Math.round(16 * s),
            flexShrink: 0,
          }}
        />

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: Math.round(13 * s), fontWeight: 600, color: tc, marginBottom: 3, lineHeight: 1.3 }}>
              {data.name || "Your Name"}
            </p>
            <p style={{ fontSize: Math.round(11.5 * s), color: tc, opacity: 0.6, lineHeight: 1.3 }}>
              {data.email || "email@example.com"}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            {data.phone && (
              <p style={{ fontSize: Math.round(11.5 * s), color: tc, opacity: 0.6, marginBottom: 2, lineHeight: 1.3 }}>
                {data.phone}
              </p>
            )}
            <p style={{ fontSize: Math.round(11.5 * s), color: tc, opacity: 0.6, lineHeight: 1.3 }}>
              {data.location || "City, Country"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Resize handle (edit mode only) ── */}
      {handles && (
        <div
          onMouseDown={onCardHandleDown}
          title="Drag to resize card"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 28,
            height: 28,
            cursor: "nwse-resize",
            background: "rgba(0,0,0,0.55)",
            borderRadius: "4px 0 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <Grip size={14} />
        </div>
      )}
    </div>
  );
}
