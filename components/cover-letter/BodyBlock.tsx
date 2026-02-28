import React from "react";

interface BodyBlockProps {
  title?: string;
  paragraphs: string[];
  tc: string;
  s: number;
}

export default function BodyBlock({
  title,
  paragraphs,
  tc,
  s,
}: BodyBlockProps) {
  return (
    <>
      <h1
        style={{
          fontSize: Math.round(22 * s),
          fontWeight: 700,
          color: tc,
          marginBottom: Math.round(24 * s),
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
          flexShrink: 0,
        }}
      >
        {title || "Job Title"}
      </h1>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p
              key={index}
              style={{
                fontSize: Math.round(13.5 * s * 10) / 10,
                lineHeight: 1.75,
                color: tc,
                marginBottom: Math.round(16 * s),
                opacity: 0.92,
                textAlign: "justify",
              }}
            >
              {paragraph}
            </p>
          ))
        ) : (
          <p
            style={{
              fontSize: Math.round(13 * s),
              lineHeight: 1.6,
              margin: 0,
              opacity: 0.25,
              fontStyle: "italic",
              color: tc,
            }}
          >
            Your cover letter text will appear here…
          </p>
        )}
      </div>
    </>
  );
}
