"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import CoverLetterCard from "./CoverLetterCard";
import { extractDominantColor, toHex, contrastText } from "@/lib/colors";
import { FormData, CardData } from "@/lib/types";
import BuilderHeader from "./builder/BuilderHeader";
import LeftToolsPanel from "./builder/LeftToolsPanel";
import PreviewPanel from "./builder/PreviewPanel";
import RightFormPanel from "./builder/RightFormPanel";

// ─── Constants ─────────────────────────────────────────────────────
const DEFAULT_BG = "#7c3aed";
const DEFAULT_TC = "#ffffff";
const PRESETS: [string, number, number][] = [
  ["A4", 595, 842],
  ["A5", 420, 595],
  ["Square", 600, 600],
  ["Wide", 800, 600],
];

export default function Builder() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    body: "",
  });

  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoW, setLogoW] = useState(120);
  const [logoH, setLogoH] = useState(40);
  const [logoRatio, setLogoRatio] = useState(3);
  const [extracting, setExtracting] = useState(false);

  const [bg, setBg] = useState(DEFAULT_BG);
  const [tc, setTc] = useState<"#ffffff" | "#111111">(DEFAULT_TC);

  const [cardW, setCardW] = useState(595);
  const [cardH, setCardH] = useState(842);

  const [downloading, setDownloading] = useState(false);
  const [preparingExport, setPreparingExport] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState({
    logo: true,
    background: true,
    canvas: true,
    info: true,
    letter: true,
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewHostRef = useRef<HTMLDivElement>(null);
  const cardSizeRef = useRef({ width: 595, height: 842 });
  const resizeRafRef = useRef<number | null>(null);
  const pendingResizeRef = useRef<{ width: number; height: number } | null>(
    null,
  );
  const [fitScale, setFitScale] = useState(1);

  const applyBg = useCallback((hex: string) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    setBg(hex);
    setTc(contrastText(hex));
  }, []);

  const setField =
    (name: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [name]: e.target.value }));

  const setLogoByH = (h: number) => {
    setLogoH(h);
    setLogoW(Math.round(h * logoRatio));
  };

  const toggleMobileSection = (key: keyof typeof mobileSectionsOpen) =>
    setMobileSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLogo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setLogoSrc(src);
        setExtracting(true);
        const img = new Image();
        img.onload = () => {
          const nat = img.naturalWidth / (img.naturalHeight || 1);
          setLogoRatio(nat);
          const h0 = 40;
          setLogoH(h0);
          setLogoW(Math.round(h0 * nat));
          try {
            const c = extractDominantColor(img);
            if (c) applyBg(toHex(c.r, c.g, c.b));
          } catch {}
          setExtracting(false);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    },
    [applyBg],
  );

  const updateFitScale = useCallback((width?: number, height?: number) => {
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
  }, []);

  const handleCardResize = (w: number, h: number) => {
    pendingResizeRef.current = {
      width: Math.round(w),
      height: Math.round(h),
    };

    if (resizeRafRef.current !== null) return;

    resizeRafRef.current = requestAnimationFrame(() => {
      resizeRafRef.current = null;
      const next = pendingResizeRef.current;
      if (!next) return;
      pendingResizeRef.current = null;
      setCardW(next.width);
      setCardH(next.height);
      cardSizeRef.current = { width: next.width, height: next.height };
      updateFitScale(next.width, next.height);
    });
  };

  useEffect(() => {
    return () => {
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
      }
    };
  }, []);

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
  }, [updateFitScale]);

  const handleDownload = async () => {
    setDownloading(true);
    setPreparingExport(true);
    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

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
      const fileBase = (form.name || "draft").replace(/\s+/g, "-");
      const a = document.createElement("a");
      a.download = `cover-letter-${fileBase}.jpg`;
      a.href = canvas.toDataURL("image/jpeg", 0.95);
      a.click();
    } catch (err) {
      console.error(err);
      alert("Failed to generate image. Please try again.");
    } finally {
      setPreparingExport(false);
      setDownloading(false);
    }
  };

  const data: CardData = { ...form, logoSrc };
  const previewScale = fitScale * (zoom / 100);

  const inputCls =
    "w-full bg-canvas-input border border-canvas-stroke text-ink rounded-lg px-3 py-2 text-[13px] outline-none transition-colors focus:border-current placeholder:text-ink-dim";

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-canvas overflow-y-auto lg:overflow-hidden text-ink">
      <BuilderHeader
        bg={bg}
        tc={tc}
        cardW={cardW}
        cardH={cardH}
        downloading={downloading}
        onDownload={handleDownload}
      />

      <div className="flex flex-col lg:flex-row flex-none lg:flex-1 overflow-visible lg:overflow-hidden min-h-0">
        <LeftToolsPanel
          mobileSectionsOpen={{
            logo: mobileSectionsOpen.logo,
            background: mobileSectionsOpen.background,
            canvas: mobileSectionsOpen.canvas,
          }}
          onToggleSection={toggleMobileSection}
          logoSrc={logoSrc}
          extracting={extracting}
          bg={bg}
          tc={tc}
          logoH={logoH}
          cardW={cardW}
          cardH={cardH}
          fileRef={fileRef}
          onHandleLogo={handleLogo}
          onClearLogo={() => {
            setLogoSrc(null);
            applyBg(DEFAULT_BG);
            setTc(DEFAULT_TC);
            if (fileRef.current) fileRef.current.value = "";
          }}
          onSetLogoByH={setLogoByH}
          onApplyBg={applyBg}
          onToggleTextColor={() =>
            setTc((currentTextColor) =>
              currentTextColor === "#ffffff" ? "#111111" : "#ffffff",
            )
          }
          onSetCardSize={(width, height) => {
            setCardW(width);
            setCardH(height);
          }}
          onSetCardW={setCardW}
          onSetCardH={setCardH}
          inputCls={inputCls}
          presets={PRESETS}
        />

        <PreviewPanel
          data={data}
          bg={bg}
          tc={tc}
          logoW={logoW}
          logoH={logoH}
          cardW={cardW}
          cardH={cardH}
          zoom={zoom}
          previewScale={previewScale}
          previewHostRef={previewHostRef}
          cardRef={cardRef}
          onZoomOut={() =>
            setZoom((currentZoom) => Math.max(50, currentZoom - 10))
          }
          onZoomIn={() =>
            setZoom((currentZoom) => Math.min(200, currentZoom + 10))
          }
          onCardResize={handleCardResize}
        />

        <RightFormPanel
          mobileSectionsOpen={{
            info: mobileSectionsOpen.info,
            letter: mobileSectionsOpen.letter,
          }}
          onToggleSection={toggleMobileSection}
          form={form}
          inputCls={inputCls}
          bg={bg}
          tc={tc}
          downloading={downloading}
          onDownload={handleDownload}
          onSetField={setField}
        />
      </div>

      {preparingExport && (
        <div
          style={{
            position: "fixed",
            left: "-10000px",
            top: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <CoverLetterCard
            data={data}
            bg={bg}
            tc={tc}
            logoW={logoW}
            logoH={logoH}
            cardW={cardW}
            cardH={cardH}
            onCardResize={() => {}}
            handles={false}
            forwardedRef={exportRef}
          />
        </div>
      )}
    </div>
  );
}
