import React from "react";
import { CardData } from "@/lib/types";

interface FooterBlockProps {
  data: CardData;
  tc: string;
  s: number;
}

export default function FooterBlock({ data, tc, s }: FooterBlockProps) {
  return (
    <>
      <div
        style={{
          width: Math.round(32 * s),
          height: 2,
          background: tc,
          opacity: 0.35,
          marginTop: Math.round(24 * s),
          marginBottom: Math.round(16 * s),
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexShrink: 0,
        }}
      >
        <div>
          <p
            style={{
              fontSize: Math.round(13 * s),
              fontWeight: 600,
              color: tc,
              marginBottom: 3,
              lineHeight: 1.3,
            }}
          >
            {data.name || "Your Name"}
          </p>
          <p
            style={{
              fontSize: Math.round(11.5 * s),
              color: tc,
              opacity: 0.6,
              lineHeight: 1.3,
            }}
          >
            {data.email || "email@example.com"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          {data.phone && (
            <p
              style={{
                fontSize: Math.round(11.5 * s),
                color: tc,
                opacity: 0.6,
                marginBottom: 2,
                lineHeight: 1.3,
              }}
            >
              {data.phone}
            </p>
          )}
          <p
            style={{
              fontSize: Math.round(11.5 * s),
              color: tc,
              opacity: 0.6,
              lineHeight: 1.3,
            }}
          >
            {data.location || "City, Country"}
          </p>
        </div>
      </div>
    </>
  );
}
