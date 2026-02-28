import { useCallback, useEffect, useRef, useState } from "react";

interface Params {
  previewHostRef: React.RefObject<HTMLDivElement>;
  cardW: number;
  cardH: number;
}

export function useFitScale({ previewHostRef, cardW, cardH }: Params) {
  const cardSizeRef = useRef({ width: cardW, height: cardH });
  const [fitScale, setFitScale] = useState(1);

  const updateFitScale = useCallback(
    (width?: number, height?: number) => {
      const host = previewHostRef.current;
      if (!host) return;

      const rect = host.getBoundingClientRect();
      const maxW = Math.max(rect.width - 8, 0);
      const maxH = Math.max(rect.height - 8, 0);
      if (!maxW || !maxH) return;

      const nextWidth = width ?? cardSizeRef.current.width;
      const nextHeight = height ?? cardSizeRef.current.height;
      const nextScale = Math.min(maxW / nextWidth, maxH / nextHeight);
      setFitScale(Math.max(0.1, nextScale));
    },
    [previewHostRef],
  );

  useEffect(() => {
    cardSizeRef.current = { width: cardW, height: cardH };
    updateFitScale(cardW, cardH);
  }, [cardW, cardH, updateFitScale]);

  useEffect(() => {
    const host = previewHostRef.current;
    if (!host) return;

    const handleWindowResize = () => updateFitScale();
    const observer = new ResizeObserver(() => updateFitScale());
    observer.observe(host);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [previewHostRef, updateFitScale]);

  return { fitScale, updateFitScale };
}
