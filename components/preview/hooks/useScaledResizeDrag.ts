import { useCallback } from "react";
import { startDrag } from "@/lib/drag";

interface Params {
  cardW: number;
  cardH: number;
  scale: number;
  onCardResize: (width: number, height: number) => void;
}

export function useScaledResizeDrag({
  cardW,
  cardH,
  scale,
  onCardResize,
}: Params) {
  return useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const startWidth = cardW;
      const startHeight = cardH;

      startDrag(event, (clientX, clientY) => {
        const deltaX = (clientX - event.clientX) / scale;
        const deltaY = (clientY - event.clientY) / scale;
        onCardResize(
          Math.max(300, startWidth + deltaX),
          Math.max(400, startHeight + deltaY),
        );
      });
    },
    [cardW, cardH, scale, onCardResize],
  );
}
