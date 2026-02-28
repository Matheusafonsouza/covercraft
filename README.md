# CoverCraft

A Next.js 14 + Tailwind CSS web app that generates **brand-matched cover letters** as downloadable PNG images.

## Features

- 🎨 **Auto color extraction** — upload a company logo and the dominant color fills the card background
- 🖼 **Logo size slider** — scale the logo while keeping its aspect ratio
- 📐 **Resizable canvas** — slider controls + drag-to-resize handle on the card corner
- 📄 **Size presets** — A4, A5, Square, Wide
- 👁 **Clean preview mode** — no handles, just the final image
- ⬇ **PNG export** — high-resolution (2.5×) via html2canvas

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
covercraft/
├── app/
│   ├── globals.css       # Tailwind base + custom styles
│   ├── layout.tsx        # Root layout + metadata
│   └── page.tsx          # Entry point
├── components/
│   ├── Builder.tsx         # Main app shell (sidebar + preview panel)
│   ├── CoverLetterCard.tsx # Letter rendered at real px (captured by html2canvas)
│   ├── PreviewCanvas.tsx   # Scaled wrapper (SCALE=0.6) with drag resize handle
│   ├── Slider.tsx          # Labeled range slider
│   ├── SectionCard.tsx     # Sidebar section wrapper
│   └── FieldLabel.tsx      # Uppercase label component
├── lib/
│   ├── colors.ts   # Color extraction, toHex, getLum, contrastText
│   ├── drag.ts     # Mouse drag helper
│   └── types.ts    # Shared TypeScript types
└── tailwind.config.ts
```

## How It Works

1. Upload a company logo → canvas pixel sampling extracts dominant color → fills card background
2. Fill in your name, email, phone, location, job title, and letter body
3. Adjust logo size (slider), card width/height (sliders or drag handle)
4. Switch to **Preview** tab to see the clean output
5. Hit **Download PNG** — `html2canvas` captures the card at 2.5× scale → downloads as PNG
