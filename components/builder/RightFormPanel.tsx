import React from "react";
import SectionCard from "../SectionCard";
import FieldLabel from "../FieldLabel";
import { FormData } from "@/lib/types";

type RightSectionKey = "info" | "letter";

interface RightFormPanelProps {
  mobileSectionsOpen: Record<RightSectionKey, boolean>;
  onToggleSection: (key: RightSectionKey) => void;
  form: FormData;
  inputCls: string;
  bg: string;
  tc: "#ffffff" | "#111111";
  downloading: boolean;
  onDownload: () => void;
  onSetField: (
    name: keyof FormData,
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export default function RightFormPanel({
  mobileSectionsOpen,
  onToggleSection,
  form,
  inputCls,
  bg,
  tc,
  downloading,
  onDownload,
  onSetField,
}: RightFormPanelProps) {
  return (
    <aside className="order-2 w-full lg:order-none lg:w-[340px] shrink-0 overflow-visible lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-canvas-border p-4">
      <SectionCard>
        <div className="flex items-center justify-between mb-2.5">
          <FieldLabel>Your Information</FieldLabel>
          <button
            onClick={() => onToggleSection("info")}
            className="lg:hidden w-6 h-6 rounded-md border border-canvas-stroke text-ink-muted text-sm cursor-pointer"
            aria-label="Toggle your information section"
          >
            {mobileSectionsOpen.info ? "−" : "+"}
          </button>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${mobileSectionsOpen.info ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"} lg:max-h-none lg:opacity-100`}
        >
          {[
            { name: "name" as const, label: "Full Name", ph: "Jane Doe" },
            { name: "email" as const, label: "Email", ph: "jane@example.com" },
            { name: "phone" as const, label: "Phone", ph: "(61) 9 0000-0000" },
            {
              name: "location" as const,
              label: "Location",
              ph: "Brasília, Brazil",
            },
          ].map((field) => (
            <div key={field.name} className="mb-2.5">
              <FieldLabel>{field.label}</FieldLabel>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={onSetField(field.name)}
                placeholder={field.ph}
                style={{ borderColor: "#2a2a36" }}
                onFocus={(e) => (e.target.style.borderColor = bg)}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a36")}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-center justify-between mb-2.5">
          <FieldLabel>Letter Content</FieldLabel>
          <button
            onClick={() => onToggleSection("letter")}
            className="lg:hidden w-6 h-6 rounded-md border border-canvas-stroke text-ink-muted text-sm cursor-pointer"
            aria-label="Toggle letter content section"
          >
            {mobileSectionsOpen.letter ? "−" : "+"}
          </button>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${mobileSectionsOpen.letter ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"} lg:max-h-none lg:opacity-100`}
        >
          <div className="mb-2.5">
            <FieldLabel>Job Title</FieldLabel>
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
            <FieldLabel>Body</FieldLabel>
            <textarea
              value={form.body}
              onChange={onSetField("body")}
              rows={9}
              placeholder={
                "Dear recruiter, I'm grateful for [Company]...\n\nMy X years of experience will add value.\n\nI'd love the opportunity to connect."
              }
              style={{ borderColor: "#2a2a36", resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = bg)}
              onBlur={(e) => (e.target.style.borderColor = "#2a2a36")}
              className={`${inputCls} leading-relaxed`}
            />
            <p className="text-[10px] text-ink-ghost mt-1">
              Blank line = new paragraph.
            </p>
          </div>
        </div>
      </SectionCard>

      <button
        onClick={onDownload}
        disabled={downloading}
        className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-opacity disabled:opacity-50 mb-6"
        style={{ background: bg, color: tc }}
      >
        {downloading ? "Generating image…" : "⬇ Download image"}
      </button>
    </aside>
  );
}
