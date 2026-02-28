import { useCallback, useState } from "react";
import { extractDominantColor, toHex } from "@/lib/colors";

interface Params {
  onAutoBackground: (hex: string) => void;
}

export function useLogoManager({ onAutoBackground }: Params) {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoW, setLogoW] = useState(120);
  const [logoH, setLogoH] = useState(40);
  const [logoRatio, setLogoRatio] = useState(3);
  const [extracting, setExtracting] = useState(false);

  const setLogoByH = useCallback(
    (height: number) => {
      setLogoH(height);
      setLogoW(Math.round(height * logoRatio));
    },
    [logoRatio],
  );

  const handleLogo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setLogoSrc(src);
        setExtracting(true);

        const image = new Image();
        image.onload = () => {
          const ratio = image.naturalWidth / (image.naturalHeight || 1);
          const defaultHeight = 40;

          setLogoRatio(ratio);
          setLogoH(defaultHeight);
          setLogoW(Math.round(defaultHeight * ratio));

          try {
            const dominant = extractDominantColor(image);
            if (dominant) onAutoBackground(toHex(dominant.r, dominant.g, dominant.b));
          } catch {}

          setExtracting(false);
        };

        image.src = src;
      };

      reader.readAsDataURL(file);
    },
    [onAutoBackground],
  );

  const clearLogo = useCallback(() => {
    setLogoSrc(null);
    setLogoW(120);
    setLogoH(40);
    setLogoRatio(3);
  }, []);

  return {
    logoSrc,
    logoW,
    logoH,
    extracting,
    setLogoByH,
    handleLogo,
    clearLogo,
  };
}
