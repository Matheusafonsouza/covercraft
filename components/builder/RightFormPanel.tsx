import React from "react";
import SectionCard from "../SectionCard";
import { useBuilderContext } from "./BuilderContext";
import AccordionSection from "./AccordionSection";
import {
  LETTER_BODY_PLACEHOLDER,
  PERSONAL_INFO_FIELDS,
  RIGHT_ACCORDION_HEIGHTS,
} from "./config";

export default function RightFormPanel() {
  const {
    mobileSectionsOpen,
    onToggleSection,
    form,
    inputCls,
    bg,
    uiTextColor,
    downloading,
    onDownload,
    onSetField,
  } = useBuilderContext();

  return (
    <aside className="order-2 w-full lg:order-none lg:w-[340px] shrink-0 overflow-visible lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-canvas-border p-4">
      <SectionCard>
        <AccordionSection
          title="Your Information"
          open={mobileSectionsOpen.info}
          maxHeightClass={RIGHT_ACCORDION_HEIGHTS.info}
          onToggle={() => onToggleSection("info")}
          toggleAriaLabel="Toggle your information section"
        >
          {PERSONAL_INFO_FIELDS.map((field) => (
            <div key={field.name} className="mb-2.5">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-ink-muted">
                {field.label}
              </label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={onSetField(field.name)}
                placeholder={field.placeholder}
                style={{ borderColor: "#2a2a36" }}
                onFocus={(e) => (e.target.style.borderColor = bg)}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a36")}
                className={inputCls}
              />
            </div>
          ))}
        </AccordionSection>
      </SectionCard>

      <SectionCard>
        <AccordionSection
          title="Letter Content"
          open={mobileSectionsOpen.letter}
          maxHeightClass={RIGHT_ACCORDION_HEIGHTS.letter}
          onToggle={() => onToggleSection("letter")}
          toggleAriaLabel="Toggle letter content section"
        >
          <div className="mb-2.5">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-ink-muted">
              Job Title
            </label>
            <input
              value={form.jobTitle}
              onChange={onSetField("jobTitle")}
              placeholder="Front-end Software Engineer"
              style={{ borderColor: "#2a2a36" }}
              onFocus={(e) => (e.target.style.borderColor = bg)}
              onBlur={(e) => (e.target.style.borderColor = "#2a2a36")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-ink-muted">
              Body
            </label>
            <textarea
              value={form.body}
              onChange={onSetField("body")}
              rows={9}
              placeholder={LETTER_BODY_PLACEHOLDER}
              style={{ borderColor: "#2a2a36", resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = bg)}
              onBlur={(e) => (e.target.style.borderColor = "#2a2a36")}
              className={`${inputCls} leading-relaxed`}
            />
            <p className="text-[10px] text-ink-ghost mt-1">
              Blank line = new paragraph.
            </p>
          </div>
        </AccordionSection>
      </SectionCard>

      <button
        onClick={onDownload}
        disabled={downloading}
        className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-opacity disabled:opacity-50 mb-6"
        style={{ background: bg, color: uiTextColor }}
      >
        {downloading ? "Generating image…" : "Download image"}
      </button>
    </aside>
  );
}
