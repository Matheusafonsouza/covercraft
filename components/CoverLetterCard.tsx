"use client";

import React from "react";
import { CardData } from "@/lib/types";
import { startDrag } from "@/lib/drag";
import LogoBlock from "./cover-letter/LogoBlock";
import BodyBlock from "./cover-letter/BodyBlock";
import FooterBlock from "./cover-letter/FooterBlock";
import ResizeHandle from "./cover-letter/ResizeHandle";

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

export default function CoverLetterCard({
  data,
  bg,
  tc,
  logoW,
  logoH,
  cardW,
  cardH,
  onCardResize,
  handles,
  forwardedRef,
}: Props) {
  const s = cardW / 595; // proportional scale for typography
  const paragraphs = (data.body || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const onCardHandleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const sw = cardW,
      sh = cardH;
    startDrag(e, (cx, cy) => {
      const dx = (cx - e.clientX) / SCALE;
      const dy = (cy - e.clientY) / SCALE;
      onCardResize(Math.max(300, sw + dx), Math.max(400, sh + dy));
    });
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block", lineHeight: 0 }}
    >
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
        <LogoBlock
          logoSrc={data.logoSrc}
          logoW={logoW}
          logoH={logoH}
          tc={tc}
          s={s}
        />
        <BodyBlock
          title={data.jobTitle}
          paragraphs={paragraphs}
          tc={tc}
          s={s}
        />
        <FooterBlock data={data} tc={tc} s={s} />
      </div>

      {/* ── Resize handle (edit mode only) ── */}
      {handles && <ResizeHandle onPointerDown={onCardHandleDown} />}
    </div>
  );
}
