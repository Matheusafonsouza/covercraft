import React from "react";
import Grip from "./Grip";

interface ResizeHandleProps {
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
}

export default function ResizeHandle({ onPointerDown }: ResizeHandleProps) {
  return (
    <div
      onPointerDown={onPointerDown}
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
        touchAction: "none",
      }}
    >
      <Grip size={14} />
    </div>
  );
}
