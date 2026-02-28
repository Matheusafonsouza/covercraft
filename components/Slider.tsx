"use client";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  accent: string;
  onChange: (v: number) => void;
}

export default function Slider({ label, value, min, max, step = 1, suffix = "px", accent, onChange }: Props) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-ink-muted">{label}</span>
        <span className="text-[10px] text-ink-muted font-mono">{Math.round(value)}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ accentColor: accent, background: `linear-gradient(to right, ${accent} 0%, ${accent} ${((value - min) / (max - min)) * 100}%, #2a2a36 ${((value - min) / (max - min)) * 100}%, #2a2a36 100%)` }}
        className="w-full"
      />
    </div>
  );
}
