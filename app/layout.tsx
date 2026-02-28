import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoverCraft — Brand-matched cover letters",
  description: "Generate beautiful cover letters styled to match any company logo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
