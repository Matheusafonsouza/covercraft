import React from "react";

interface GripProps {
  size?: number;
  color?: string;
}

export default function Grip({
  size = 13,
  color = "rgba(255,255,255,0.7)",
}: GripProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12">
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
        <circle key={i} cx={cx} cy={cy} r="1.5" fill={color} />
      ))}
    </svg>
  );
}
