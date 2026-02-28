"use client";

import React from "react";
import CoverLetterCard from "./CoverLetterCard";
import { CardData } from "@/lib/types";
import { startDrag } from "@/lib/drag";

const SCALE = 0.6;

interface Props {
  data: CardData;
  bg: string;
  tc: string;
  logoW: number;
  logoH: number;
  cardW: number;
  cardH: number;
  scale?: number;
  onCardResize: (w: number, h: number) => void;
  handles: boolean;
  forwardedRef: React.RefObject<HTMLDivElement>;
}

export { SCALE };

export default function PreviewCanvas({
  data,
  bg,
  tc,
  logoW,
  logoH,
  cardW,
  cardH,
  scale = SCALE,
  onCardResize,
  handles,
  forwardedRef,
}: Props) {
  const visW = Math.round(cardW * scale);
  const visH = Math.round(cardH * scale);

  const onOuterHandleDown = (e: React.MouseEvent) => {
    const sw = cardW,
      sh = cardH;
    startDrag(e, (cx, cy) => {
      const dx = (cx - e.clientX) / scale;
      const dy = (cy - e.clientY) / scale;
      onCardResize(Math.max(300, sw + dx), Math.max(400, sh + dy));
    });
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block", lineHeight: 0 }}
    >
      {/* Clip box at visual (scaled) dimensions */}
      <div
        style={{
          width: visW,
          height: visH,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Scale transform */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: cardW,
            height: cardH,
          }}
        >
          <CoverLetterCard
            data={data}
            bg={bg}
            tc={tc}
            logoW={logoW}
            logoH={logoH}
            cardW={cardW}
            cardH={cardH}
            onCardResize={onCardResize}
            handles={false} // inner handles disabled — use outer handle below
            forwardedRef={forwardedRef}
          />
        </div>
      </div>

      {/* Outer resize handle — lives outside scale transform, so 1px drag == correct */}
      {handles && (
        <>
          <div
            onMouseDown={onOuterHandleDown}
            title="Drag to resize card"
            className="absolute bottom-0 right-0 w-7 h-7 cursor-nwse-resize bg-black/60 rounded-tl flex items-center justify-center z-20"
          >
            <svg width="14" height="14" viewBox="0 0 12 12">
              {(
                [
                  [4, 8],
                  [8, 4],
                  [8, 8],
                  [12, 4],
                  [12, 8],
                  [12, 12],
                ] as [number, number][]
              ).map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="1.5"
                  fill="rgba(255,255,255,0.7)"
                />
              ))}
            </svg>
          </div>
          <p className="absolute -bottom-5 left-0 text-[10px] text-ink-ghost font-mono select-none">
            {Math.round(cardW)} × {Math.round(cardH)} px
          </p>
        </>
      )}
    </div>
  );
}
