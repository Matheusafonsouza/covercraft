import React from "react";
import PreviewCanvas from "../PreviewCanvas";
import { CardData } from "@/lib/types";

interface PreviewPanelProps {
  data: CardData;
  bg: string;
  tc: string;
  logoW: number;
  logoH: number;
  cardW: number;
  cardH: number;
  zoom: number;
  previewScale: number;
  previewHostRef: React.RefObject<HTMLDivElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onCardResize: (width: number, height: number) => void;
}

export default function PreviewPanel({
  data,
  bg,
  tc,
  logoW,
  logoH,
  cardW,
  cardH,
  zoom,
  previewScale,
  previewHostRef,
  cardRef,
  onZoomOut,
  onZoomIn,
  onCardResize,
}: PreviewPanelProps) {
  return (
    <main className="order-3 lg:order-none flex-1 overflow-hidden bg-[#060609] px-4 lg:px-8 pt-4 lg:pt-6 pb-4 lg:pb-6 min-h-[50vh] lg:min-h-0">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-1.5">
            {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
              <div
                key={color}
                className="w-2 h-2 rounded-full"
                style={{ background: color }}
              />
            ))}
            <span className="text-[10px] text-ink-ghost ml-1 tracking-wide">
              coverletter.png · drag ↘ corner to resize
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onZoomOut}
              disabled={zoom <= 50}
              className="w-7 h-7 rounded-md bg-canvas-surface border border-canvas-border text-ink text-sm font-semibold disabled:opacity-40 cursor-pointer"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="w-12 text-center text-[11px] text-ink-muted font-mono">
              {zoom}%
            </span>
            <button
              onClick={onZoomIn}
              disabled={zoom >= 200}
              className="w-7 h-7 rounded-md bg-canvas-surface border border-canvas-border text-ink text-sm font-semibold disabled:opacity-40 cursor-pointer"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>

        <div ref={previewHostRef} className="flex-1 overflow-auto">
          <div className="w-full min-h-full flex items-start justify-center pt-1">
            <div
              className="inline-block rounded-sm"
              style={{
                boxShadow:
                  "0 28px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              <PreviewCanvas
                data={data}
                bg={bg}
                tc={tc}
                logoW={logoW}
                logoH={logoH}
                cardW={cardW}
                cardH={cardH}
                scale={previewScale}
                onCardResize={onCardResize}
                handles={true}
                forwardedRef={cardRef}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
