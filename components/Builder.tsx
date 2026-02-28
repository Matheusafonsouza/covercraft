"use client";

import { useState, useRef, useCallback } from "react";
import PreviewCanvas, { SCALE } from "./PreviewCanvas";
import CoverLetterCard from "./CoverLetterCard";
import Slider from "./Slider";
import SectionCard from "./SectionCard";
import FieldLabel from "./FieldLabel";
import { extractDominantColor, toHex, contrastText, getLum } from "@/lib/colors";
import { FormData, CardData } from "@/lib/types";

// ─── Constants ─────────────────────────────────────────────────────
const DEFAULT_BG   = "#7c3aed";
const DEFAULT_TC   = "#ffffff";
const PRESETS: [string, number, number][] = [
  ["A4", 595, 842],
  ["A5", 420, 595],
  ["Square", 600, 600],
  ["Wide", 800, 600],
];

export default function Builder() {
  // Form
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", location: "", jobTitle: "", body: "",
  });

  // Logo
  const [logoSrc, setLogoSrc]     = useState<string | null>(null);
  const [logoW, setLogoW]         = useState(120);
  const [logoH, setLogoH]         = useState(40);
  const [logoRatio, setLogoRatio] = useState(3);
  const [extracting, setExtracting] = useState(false);

  // Colors
  const [bg, setBg] = useState(DEFAULT_BG);
  const [tc, setTc] = useState<"#ffffff" | "#111111">(DEFAULT_TC);

  // Card size
  const [cardW, setCardW] = useState(595);
  const [cardH, setCardH] = useState(842);

  // UI state
  const [tab, setTab]             = useState<"edit" | "preview">("edit");
  const [downloading, setDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Helpers ──────────────────────────────────────────────────────
  const applyBg = useCallback((hex: string) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    setBg(hex);
    setTc(contrastText(hex));
  }, []);

  const setField = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [name]: e.target.value }));

  const setLogoByH = (h: number) => {
    setLogoH(h);
    setLogoW(Math.round(h * logoRatio));
  };

  // ── Logo upload ──────────────────────────────────────────────────
  const handleLogo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [applyBg]);

  // ── Card resize ──────────────────────────────────────────────────
  const handleCardResize = (w: number, h: number) => {
    setCardW(Math.round(w));
    setCardH(Math.round(h));
  };

  // ── Download ─────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: bg,
        logging: false,
        width: cardW,
        height: cardH,
      });
      const a = document.createElement("a");
      a.download = `cover-letter-${(form.name || "draft").replace(/\s+/g, "-")}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (err) {
      console.error(err);
      alert("Failed to generate PNG. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // ── Data ─────────────────────────────────────────────────────────
  const data: CardData = { ...form, logoSrc };

  // ── Shared input className ────────────────────────────────────────
  const inputCls = "w-full bg-canvas-input border border-canvas-stroke text-ink rounded-lg px-3 py-2 text-[13px] outline-none transition-colors focus:border-current placeholder:text-ink-dim";

  return (
    <div className="flex flex-col h-screen bg-canvas overflow-hidden text-ink">

      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-canvas-border px-5 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold transition-colors duration-300"
            style={{ background: bg, color: tc }}
          >
            ✦
          </div>
          <span className="text-base font-bold tracking-tight">CoverCraft</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Meta badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-canvas-surface border border-canvas-border rounded-md">
            <div className="w-3 h-3 rounded-sm shrink-0 transition-colors duration-300" style={{ background: bg }} />
            <span className="text-[10px] text-ink-muted">{bg.toUpperCase()}</span>
            <span className="text-[10px] text-canvas-border">·</span>
            <span className="text-[10px] text-ink-muted font-mono">{cardW}×{cardH}</span>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-opacity disabled:opacity-50 cursor-pointer"
            style={{ background: bg, color: tc }}
          >
            {downloading ? "Generating…" : "⬇ Download PNG"}
          </button>
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className="flex border-b border-canvas-border shrink-0">
        {(["edit", "preview"] as const).map(id => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer bg-transparent border-none"
            style={{
              borderBottom: tab === id ? `2px solid ${bg}` : "2px solid transparent",
              color: tab === id ? "#e8e6e1" : "#555568",
            }}
          >
            {id === "edit" ? "✏ Edit" : "👁 Preview"}
          </button>
        ))}
      </div>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── Left panel ── */}
        <aside className="w-[310px] shrink-0 overflow-y-auto border-r border-canvas-border p-4">

          {/* Logo */}
          <SectionCard>
            <FieldLabel>Company Logo</FieldLabel>
            {logoSrc ? (
              <>
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border mb-3"
                  style={{ background: bg + "22", borderColor: bg + "55" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoSrc} alt="logo" className="h-7 max-w-[90px] object-contain block" />
                  <p className="flex-1 text-[11px] text-ink">
                    {extracting ? "Extracting…" : <><span className="font-mono">{bg}</span> ✓</>}
                  </p>
                  <button
                    onClick={() => {
                      setLogoSrc(null);
                      applyBg(DEFAULT_BG);
                      setTc(DEFAULT_TC);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded bg-canvas-stroke text-ink text-sm shrink-0 cursor-pointer border-none"
                  >
                    ×
                  </button>
                </div>
                <Slider label="Logo Size" value={logoH} min={16} max={120} onChange={setLogoByH} accent={bg} />
              </>
            ) : (
              <label
                className="flex flex-col items-center gap-1.5 py-5 border-2 border-dashed border-canvas-stroke rounded-xl cursor-pointer transition-colors hover:border-current"
                style={{ "--tw-border-opacity": 1 } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.borderColor = bg)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "")}
              >
                <span className="text-xl">⬆️</span>
                <span className="text-xs text-ink-muted">Upload logo (PNG / JPG / SVG)</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogo}
                  className="hidden"
                />
              </label>
            )}
          </SectionCard>

          {/* Background color */}
          <SectionCard>
            <FieldLabel>Background Color</FieldLabel>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={bg}
                onChange={e => applyBg(e.target.value)}
                className="w-9 h-8 rounded-md border-none cursor-pointer p-0 shrink-0"
              />
              <input
                value={bg}
                onChange={e => applyBg(e.target.value)}
                style={{ borderColor: "#2a2a36" }}
                onFocus={e => (e.target.style.borderColor = bg)}
                onBlur={e => (e.target.style.borderColor = "#2a2a36")}
                className={`${inputCls} flex-1 font-mono`}
              />
              <button
                onClick={() => setTc(t => t === "#ffffff" ? "#111111" : "#ffffff")}
                className="px-2 py-1.5 bg-canvas-input border border-canvas-stroke rounded-lg text-ink text-[11px] whitespace-nowrap cursor-pointer shrink-0"
              >
                {tc === "#ffffff" ? "☀ Dark" : "☾ Light"}
              </button>
            </div>
          </SectionCard>

          {/* Canvas size */}
          <SectionCard>
            <div className="flex justify-between items-center mb-2.5">
              <FieldLabel>Canvas Size</FieldLabel>
              <span className="text-[10px] text-ink-muted font-mono">{cardW}×{cardH}</span>
            </div>

            {/* Presets */}
            <div className="flex gap-1.5 mb-3">
              {PRESETS.map(([name, w, h]) => (
                <button
                  key={name}
                  onClick={() => { setCardW(w); setCardH(h); }}
                  className="flex-1 py-1 text-[10px] font-semibold rounded cursor-pointer transition-all border"
                  style={{
                    borderColor: cardW === w && cardH === h ? bg : "#2a2a36",
                    background:  cardW === w && cardH === h ? bg + "22" : "#1a1a22",
                    color:       cardW === w && cardH === h ? "#e8e6e1" : "#555568",
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            <Slider label="Width"  value={cardW} min={300} max={900}  onChange={v => setCardW(v)} accent={bg} />
            <Slider label="Height" value={cardH} min={400} max={1300} onChange={v => setCardH(v)} accent={bg} />

            <p className="text-[10px] text-ink-ghost leading-relaxed mt-1">
              Also drag the <strong className="text-ink-dim">↘ grip</strong> on the card corner (Edit mode).
            </p>
          </SectionCard>

          {/* Personal info */}
          <SectionCard>
            <FieldLabel>Your Information</FieldLabel>
            {(
              [
                { name: "name"     as const, label: "Full Name", ph: "Jane Doe" },
                { name: "email"    as const, label: "Email",     ph: "jane@example.com" },
                { name: "phone"    as const, label: "Phone",     ph: "(61) 9 0000-0000" },
                { name: "location" as const, label: "Location",  ph: "Brasília, Brazil" },
              ]
            ).map(f => (
              <div key={f.name} className="mb-2.5">
                <FieldLabel>{f.label}</FieldLabel>
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={setField(f.name)}
                  placeholder={f.ph}
                  style={{ borderColor: "#2a2a36" }}
                  onFocus={e => (e.target.style.borderColor = bg)}
                  onBlur={e => (e.target.style.borderColor = "#2a2a36")}
                  className={inputCls}
                />
              </div>
            ))}
          </SectionCard>

          {/* Letter content */}
          <SectionCard>
            <FieldLabel>Letter Content</FieldLabel>
            <div className="mb-2.5">
              <FieldLabel>Job Title</FieldLabel>
              <input
                value={form.jobTitle}
                onChange={setField("jobTitle")}
                placeholder="Front-end Software Engineer"
                style={{ borderColor: "#2a2a36" }}
                onFocus={e => (e.target.style.borderColor = bg)}
                onBlur={e => (e.target.style.borderColor = "#2a2a36")}
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel>Body</FieldLabel>
              <textarea
                value={form.body}
                onChange={setField("body")}
                rows={9}
                placeholder={"Dear recruiter, I'm grateful for [Company]...\n\nMy X years of experience will add value.\n\nI'd love the opportunity to connect."}
                style={{ borderColor: "#2a2a36", resize: "vertical" }}
                onFocus={e => (e.target.style.borderColor = bg)}
                onBlur={e => (e.target.style.borderColor = "#2a2a36")}
                className={`${inputCls} leading-relaxed`}
              />
              <p className="text-[10px] text-ink-ghost mt-1">Blank line = new paragraph.</p>
            </div>
          </SectionCard>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-opacity disabled:opacity-50 mb-6"
            style={{ background: bg, color: tc }}
          >
            {downloading ? "Generating PNG…" : "⬇ Download as PNG"}
          </button>
        </aside>

        {/* ── Right panel (preview) ── */}
        <main className="flex-1 overflow-auto bg-[#060609] flex items-start justify-center px-8 pt-11 pb-20">
          <div>
            {/* macOS dots */}
            <div className="flex items-center gap-1.5 mb-3.5">
              {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
              ))}
              <span className="text-[10px] text-ink-ghost ml-1 tracking-wide">
                {tab === "edit"
                  ? "coverletter.png · drag ↘ corner to resize"
                  : "coverletter.png · clean preview"}
              </span>
            </div>

            {/* Card frame */}
            <div
              className="inline-block rounded-sm"
              style={{ boxShadow: "0 28px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)" }}
            >
              {tab === "edit" ? (
                <PreviewCanvas
                  data={data} bg={bg} tc={tc}
                  logoW={logoW} logoH={logoH}
                  cardW={cardW} cardH={cardH}
                  onCardResize={handleCardResize}
                  handles={true}
                  forwardedRef={cardRef}
                />
              ) : (
                /* Clean preview — no handles, pointer-events disabled */
                <div
                  style={{
                    width: Math.round(cardW * SCALE),
                    height: Math.round(cardH * SCALE),
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${SCALE})`,
                      transformOrigin: "top left",
                      width: cardW,
                      height: cardH,
                      pointerEvents: "none",
                    }}
                  >
                    <CoverLetterCard
                      data={data} bg={bg} tc={tc}
                      logoW={logoW} logoH={logoH}
                      cardW={cardW} cardH={cardH}
                      onCardResize={() => {}}
                      handles={false}
                      forwardedRef={cardRef}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
