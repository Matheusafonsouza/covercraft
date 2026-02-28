import React from "react";
import FieldLabel from "../FieldLabel";

interface Props {
  title: string;
  open: boolean;
  maxHeightClass: string;
  onToggle: () => void;
  children: React.ReactNode;
  right?: React.ReactNode;
  toggleAriaLabel: string;
}

export default function AccordionSection({
  title,
  open,
  maxHeightClass,
  onToggle,
  children,
  right,
  toggleAriaLabel,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between mb-2.5">
        <FieldLabel>{title}</FieldLabel>
        <div className="flex items-center gap-2">
          {right}
          <button
            onClick={onToggle}
            className="lg:hidden w-6 h-6 rounded-md border border-canvas-stroke text-ink-muted text-sm cursor-pointer"
            aria-label={toggleAriaLabel}
          >
            {open ? "−" : "+"}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${open ? `${maxHeightClass} opacity-100` : "max-h-0 opacity-0"} lg:max-h-none lg:opacity-100`}
      >
        {children}
      </div>
    </>
  );
}
