import React from "react";

interface BuilderHeaderProps {
  bg: string;
  tc: string;
  cardW: number;
  cardH: number;
  downloading: boolean;
  onDownload: () => void;
}

export default function BuilderHeader({
  bg,
  tc,
  cardW,
  cardH,
  downloading,
  onDownload,
}: BuilderHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-canvas-border px-4 py-3 shrink-0 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold transition-colors duration-300"
          style={{ background: bg, color: tc }}
        >
          ✦
        </div>
        <span className="text-base font-bold tracking-tight">CoverCraft</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-canvas-surface border border-canvas-border rounded-md">
          <div
            className="w-3 h-3 rounded-sm shrink-0 transition-colors duration-300"
            style={{ background: bg }}
          />
          <span className="text-[10px] text-ink-muted">{bg.toUpperCase()}</span>
          <span className="text-[10px] text-canvas-border">·</span>
          <span className="text-[10px] text-ink-muted font-mono">
            {cardW}×{cardH}
          </span>
        </div>

        <button
          onClick={onDownload}
          disabled={downloading}
          className="px-4 py-2 rounded-lg text-xs font-bold transition-opacity disabled:opacity-50 cursor-pointer"
          style={{ background: bg, color: tc }}
        >
          {downloading ? "Generating…" : "⬇ Download Image"}
        </button>
      </div>
    </header>
  );
}
