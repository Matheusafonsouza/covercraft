"use client";

import React, { createContext, useContext } from "react";
import { CardData, FormData } from "@/lib/types";

export type BuilderSectionKey =
  | "logo"
  | "background"
  | "canvas"
  | "info"
  | "letter";

export interface BuilderContextValue {
  bg: string;
  tc: "#ffffff" | "#111111";
  uiTextColor: "#ffffff" | "#111111";
  cardW: number;
  cardH: number;
  downloading: boolean;
  zoom: number;
  previewScale: number;
  logoSrc: string | null;
  logoW: number;
  logoH: number;
  extracting: boolean;
  form: FormData;
  data: CardData;
  inputCls: string;
  fileRef: React.RefObject<HTMLInputElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  previewHostRef: React.RefObject<HTMLDivElement>;
  mobileSectionsOpen: Record<BuilderSectionKey, boolean>;
  presets: [string, number, number][];
  onToggleSection: (key: BuilderSectionKey) => void;
  onDownload: () => void;
  onHandleLogo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearLogo: () => void;
  onSetLogoByH: (value: number) => void;
  onApplyBg: (hex: string) => void;
  onToggleTextColor: () => void;
  onSetCardSize: (width: number, height: number) => void;
  onSetCardW: (value: number) => void;
  onSetCardH: (value: number) => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onCardResize: (width: number, height: number) => void;
  onSetField: (
    name: keyof FormData,
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({
  value,
  children,
}: {
  value: BuilderContextValue;
  children: React.ReactNode;
}) {
  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
}

export function useBuilderContext() {
  const ctx = useContext(BuilderContext);
  if (!ctx) {
    throw new Error("useBuilderContext must be used inside BuilderProvider");
  }
  return ctx;
}
