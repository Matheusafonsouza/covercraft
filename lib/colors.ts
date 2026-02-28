export const toHex = (r: number, g: number, b: number): string =>
  "#" +
  [r, g, b]
    .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
    .join("");

export const getLum = (r: number, g: number, b: number): number =>
  0.299 * r + 0.587 * g + 0.114 * b;

/** Extract dominant non-white/non-black color from an img element via canvas */
export const extractDominantColor = (
  imgEl: HTMLImageElement,
): { r: number; g: number; b: number } | null => {
  const canvas = document.createElement("canvas");
  canvas.width = 80;
  canvas.height = 80;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(imgEl, 0, 0, 80, 80);
  const data = ctx.getImageData(0, 0, 80, 80).data;

  const freq: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // transparent
    const r = Math.round(data[i] / 24) * 24;
    const g = Math.round(data[i + 1] / 24) * 24;
    const b = Math.round(data[i + 2] / 24) * 24;
    const lum = getLum(r, g, b);
    if (lum > 230 || lum < 20) continue; // skip near-white / near-black
    const key = `${r},${g},${b}`;
    freq[key] = (freq[key] || 0) + 1;
  }

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return null;

  const [r, g, b] = sorted[0][0].split(",").map(Number);
  return { r, g, b };
};

/** Given a hex color, return the best contrasting text color */
export const contrastText = (hex: string): "#ffffff" | "#111111" => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return getLum(r, g, b) > 160 ? "#111111" : "#ffffff";
};
