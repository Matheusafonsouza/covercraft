import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoverCraft — Brand-matched cover letters",
  description:
    "Generate beautiful cover letters styled to match any company logo",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "CoverCraft — Brand-matched cover letters",
    description:
      "Generate beautiful cover letters styled to match any company logo",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoverCraft — Brand-matched cover letters",
    description:
      "Generate beautiful cover letters styled to match any company logo",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
