"use client";

import React from "react";
import CoverLetterCard from "./CoverLetterCard";
import { CardData } from "@/lib/types";
import { useScaledResizeDrag } from "./preview/hooks/useScaledResizeDrag";
import PreviewResizeHandle from "./preview/PreviewResizeHandle";

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

  const onOuterHandleDown = useScaledResizeDrag({
    cardW,
    cardH,
    scale,
    onCardResize,
  });

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
        <PreviewResizeHandle
          cardW={cardW}
          cardH={cardH}
          onPointerDown={onOuterHandleDown}
        />
      )}
    </div>
  );
}
