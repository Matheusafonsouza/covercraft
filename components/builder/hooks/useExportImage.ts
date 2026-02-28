import { useCallback, useState } from "react";
import { toDownloadBaseName } from "../helpers";

interface Params {
  exportRef: React.RefObject<HTMLDivElement>;
  bg: string;
  cardW: number;
  cardH: number;
  fileNameSeed: string;
}

export function useExportImage({
  exportRef,
  bg,
  cardW,
  cardH,
  fileNameSeed,
}: Params) {
  const [downloading, setDownloading] = useState(false);
  const [preparingExport, setPreparingExport] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setPreparingExport(true);

    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      if (!exportRef.current) {
        throw new Error("Export target not ready");
      }

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: bg,
        logging: false,
        width: cardW,
        height: cardH,
      });

      const fileBase = toDownloadBaseName(fileNameSeed);
      const link = document.createElement("a");
      link.download = `cover-letter-${fileBase}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setPreparingExport(false);
      setDownloading(false);
    }
  }, [bg, cardW, cardH, exportRef, fileNameSeed]);

  return { downloading, preparingExport, handleDownload };
}
