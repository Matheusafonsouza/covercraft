import React from "react";
import Slider from "../Slider";
import SectionCard from "../SectionCard";
import { useBuilderContext } from "./BuilderContext";
import AccordionSection from "./AccordionSection";
import { LEFT_ACCORDION_HEIGHTS } from "./config";

export default function LeftToolsPanel() {
  const {
    mobileSectionsOpen,
    onToggleSection,
    logoSrc,
    extracting,
    bg,
    tc,
    logoH,
    cardW,
    cardH,
    fileRef,
    onHandleLogo,
    onClearLogo,
    onSetLogoByH,
    onApplyBg,
    onToggleTextColor,
    onSetCardSize,
    onSetCardW,
    onSetCardH,
    inputCls,
    presets,
  } = useBuilderContext();

  return (
    <aside className="order-1 w-full lg:order-none lg:w-[300px] shrink-0 overflow-visible lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-canvas-border p-4">
      <SectionCard>
        <AccordionSection
          title="Company Logo"
          open={mobileSectionsOpen.logo}
          maxHeightClass={LEFT_ACCORDION_HEIGHTS.logo}
          onToggle={() => onToggleSection("logo")}
          toggleAriaLabel="Toggle company logo section"
        >
          {logoSrc ? (
            <>
              <div
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border mb-3"
                style={{ background: bg + "22", borderColor: bg + "55" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt="logo"
                  className="h-7 max-w-[90px] object-contain block"
                />
                <p className="flex-1 text-[11px] text-ink">
                  {extracting ? (
                    "Extracting…"
                  ) : (
                    <>
                      <span className="font-mono">{bg}</span> ✓
                    </>
                  )}
                </p>
                <button
                  onClick={onClearLogo}
                  className="w-6 h-6 flex items-center justify-center rounded bg-canvas-stroke text-ink text-sm shrink-0 cursor-pointer border-none"
                >
                  ×
                </button>
              </div>
              <Slider
                label="Logo Size"
                value={logoH}
                min={16}
                max={120}
                onChange={onSetLogoByH}
                accent={bg}
              />
            </>
          ) : (
            <label
              className="flex flex-col items-center gap-1.5 py-5 border-2 border-dashed border-canvas-stroke rounded-xl cursor-pointer transition-colors hover:border-current"
              style={{ "--tw-border-opacity": 1 } as React.CSSProperties}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = bg)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
            >
              <span className="text-xl">⬆️</span>
              <span className="text-xs text-ink-muted">
                Upload logo (PNG / JPG / SVG)
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onHandleLogo}
                className="hidden"
              />
            </label>
          )}
        </AccordionSection>
      </SectionCard>

      <SectionCard>
        <AccordionSection
          title="Background Color"
          open={mobileSectionsOpen.background}
          maxHeightClass={LEFT_ACCORDION_HEIGHTS.background}
          onToggle={() => onToggleSection("background")}
          toggleAriaLabel="Toggle background color section"
        >
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={bg}
              onChange={(e) => onApplyBg(e.target.value)}
              className="w-9 h-8 rounded-md border-none cursor-pointer p-0 shrink-0"
            />
            <input
              value={bg}
              onChange={(e) => onApplyBg(e.target.value)}
              style={{ borderColor: "#2a2a36" }}
              onFocus={(e) => (e.target.style.borderColor = bg)}
              onBlur={(e) => (e.target.style.borderColor = "#2a2a36")}
              className={`${inputCls} flex-1 font-mono`}
            />
            <button
              onClick={onToggleTextColor}
              className="px-2 py-1.5 bg-canvas-input border border-canvas-stroke rounded-lg text-ink text-[11px] whitespace-nowrap cursor-pointer shrink-0"
            >
              {tc === "#ffffff" ? "☀ Dark" : "☾ Light"}
            </button>
          </div>
        </AccordionSection>
      </SectionCard>

      <SectionCard>
        <AccordionSection
          title="Canvas Size"
          open={mobileSectionsOpen.canvas}
          maxHeightClass={LEFT_ACCORDION_HEIGHTS.canvas}
          onToggle={() => onToggleSection("canvas")}
          toggleAriaLabel="Toggle canvas size section"
          right={
            <span className="text-[10px] text-ink-muted font-mono">
              {cardW}×{cardH}
            </span>
          }
        >
          <div className="flex gap-1.5 mb-3">
            {presets.map(([name, width, height]) => (
              <button
                key={name}
                onClick={() => onSetCardSize(width, height)}
                className="flex-1 py-1 text-[10px] font-semibold rounded cursor-pointer transition-all border"
                style={{
                  borderColor:
                    cardW === width && cardH === height ? bg : "#2a2a36",
                  background:
                    cardW === width && cardH === height ? bg + "22" : "#1a1a22",
                  color:
                    cardW === width && cardH === height ? "#e8e6e1" : "#555568",
                }}
              >
                {name}
              </button>
            ))}
          </div>

          <Slider
            label="Width"
            value={cardW}
            min={300}
            max={900}
            onChange={onSetCardW}
            accent={bg}
          />
          <Slider
            label="Height"
            value={cardH}
            min={400}
            max={1300}
            onChange={onSetCardH}
            accent={bg}
          />

          <p className="text-[10px] text-ink-ghost leading-relaxed mt-1">
            Also drag the <strong className="text-ink-dim">↘ grip</strong> on
            the card corner (Edit mode).
          </p>
        </AccordionSection>
      </SectionCard>
    </aside>
  );
}
