import React from "react";

interface Props {
  cardW: number;
  cardH: number;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
}

export default function PreviewResizeHandle({
  cardW,
  cardH,
  onPointerDown,
}: Props) {
  return (
    <>
      <div
        onPointerDown={onPointerDown}
        title="Drag to resize card"
        className="absolute bottom-0 right-0 w-7 h-7 cursor-nwse-resize bg-black/60 rounded-tl flex items-center justify-center z-20"
        style={{ touchAction: "none" }}
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
          ).map(([cx, cy], index) => (
            <circle
              key={index}
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
  );
}
