import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#0a0a10",
          surface: "#13131a",
          panel:   "#0e0e16",
          border:  "#1e1e2c",
          input:   "#1a1a22",
          stroke:  "#2a2a36",
        },
        ink: {
          DEFAULT: "#e8e6e1",
          muted:   "#555568",
          dim:     "#333340",
          ghost:   "#252535",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
