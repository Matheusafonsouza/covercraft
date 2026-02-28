import { useCallback, useMemo, useRef, useState } from "react";
import { contrastText } from "@/lib/colors";
import { FormData } from "@/lib/types";
import { useFitScale } from "./useFitScale";
import { useRafCardResize } from "./useRafCardResize";
import { useLogoManager } from "./useLogoManager";
import { useExportImage } from "./useExportImage";
import {
  DEFAULT_BG,
  DEFAULT_TC,
  INITIAL_FORM,
  INITIAL_MOBILE_SECTIONS,
  INPUT_CLS,
  PRESETS,
  isValidHexColor,
} from "../helpers";

export function useBuilderController() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const [bg, setBg] = useState(DEFAULT_BG);
  const [tc, setTc] = useState<"#ffffff" | "#111111">(DEFAULT_TC);

  const [cardW, setCardW] = useState(595);
  const [cardH, setCardH] = useState(842);

  const [zoom, setZoom] = useState(100);
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(
    INITIAL_MOBILE_SECTIONS,
  );

  const cardRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewHostRef = useRef<HTMLDivElement>(null);

  const applyBg = useCallback((hex: string) => {
    if (!isValidHexColor(hex)) return;
    setBg(hex);
    setTc(contrastText(hex));
  }, []);

  const {
    logoSrc,
    logoW,
    logoH,
    extracting,
    setLogoByH,
    handleLogo,
    clearLogo,
  } = useLogoManager({ onAutoBackground: applyBg });

  const setField =
    (name: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [name]: event.target.value }));

  const toggleMobileSection = useCallback(
    (key: keyof typeof mobileSectionsOpen) =>
      setMobileSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] })),
    [],
  );

  const { fitScale, updateFitScale } = useFitScale({
    previewHostRef,
    cardW,
    cardH,
  });

  const handleCardResize = useRafCardResize((width, height) => {
    setCardW(width);
    setCardH(height);
    updateFitScale(width, height);
  });

  const data = useMemo(() => ({ ...form, logoSrc }), [form, logoSrc]);
  const previewScale = fitScale * (zoom / 100);
  const uiTextColor = contrastText(bg);

  const { downloading, preparingExport, handleDownload } = useExportImage({
    exportRef,
    bg,
    cardW,
    cardH,
    fileNameSeed: form.name,
  });

  const contextValue = {
    bg,
    tc,
    uiTextColor,
    cardW,
    cardH,
    downloading,
    zoom,
    previewScale,
    logoSrc,
    logoW,
    logoH,
    extracting,
    form,
    data,
    inputCls: INPUT_CLS,
    fileRef,
    cardRef,
    previewHostRef,
    mobileSectionsOpen,
    presets: PRESETS,
    onToggleSection: toggleMobileSection,
    onDownload: handleDownload,
    onHandleLogo: handleLogo,
    onClearLogo: () => {
      clearLogo();
      applyBg(DEFAULT_BG);
      setTc(DEFAULT_TC);
      if (fileRef.current) fileRef.current.value = "";
    },
    onSetLogoByH: setLogoByH,
    onApplyBg: applyBg,
    onToggleTextColor: () =>
      setTc((currentTextColor) =>
        currentTextColor === "#ffffff" ? "#111111" : "#ffffff",
      ),
    onSetCardSize: (width: number, height: number) => {
      setCardW(width);
      setCardH(height);
    },
    onSetCardW: setCardW,
    onSetCardH: setCardH,
    onZoomOut: () => setZoom((currentZoom) => Math.max(50, currentZoom - 10)),
    onZoomIn: () => setZoom((currentZoom) => Math.min(200, currentZoom + 10)),
    onCardResize: handleCardResize,
    onSetField: setField,
  };

  return {
    contextValue,
    preparingExport,
    exportRef,
    exportCard: {
      data,
      bg,
      tc,
      logoW,
      logoH,
      cardW,
      cardH,
    },
  };
}
