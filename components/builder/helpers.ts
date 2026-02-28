import { FormData } from "@/lib/types";

export const DEFAULT_BG = "#7c3aed";
export const DEFAULT_TC: "#ffffff" | "#111111" = "#ffffff";

export const PRESETS: [string, number, number][] = [
  ["A4", 595, 842],
  ["A5", 420, 595],
  ["Square", 600, 600],
  ["Wide", 800, 600],
];

export const INPUT_CLS =
  "w-full bg-canvas-input border border-canvas-stroke text-ink rounded-lg px-3 py-2 text-[13px] outline-none transition-colors focus:border-current placeholder:text-ink-dim";

export const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  jobTitle: "",
  body: "",
};

export const INITIAL_MOBILE_SECTIONS = {
  logo: true,
  background: true,
  canvas: true,
  info: true,
  letter: true,
};

export const isValidHexColor = (hex: string): boolean =>
  /^#[0-9a-fA-F]{6}$/.test(hex);

export const toDownloadBaseName = (name: string): string =>
  (name || "draft").trim().replace(/\s+/g, "-");
