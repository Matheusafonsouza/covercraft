import { useCallback, useEffect, useRef } from "react";

export function useRafCardResize(
  onResizeFrame: (width: number, height: number) => void,
) {
  const resizeRafRef = useRef<number | null>(null);
  const pendingResizeRef = useRef<{ width: number; height: number } | null>(
    null,
  );

  const handleCardResize = useCallback(
    (width: number, height: number) => {
      pendingResizeRef.current = {
        width: Math.round(width),
        height: Math.round(height),
      };

      if (resizeRafRef.current !== null) return;

      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        const next = pendingResizeRef.current;
        if (!next) return;
        pendingResizeRef.current = null;
        onResizeFrame(next.width, next.height);
      });
    },
    [onResizeFrame],
  );

  useEffect(() => {
    return () => {
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
      }
    };
  }, []);

  return handleCardResize;
}
