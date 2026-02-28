"use client";

import CoverLetterCard from "./CoverLetterCard";
import BuilderHeader from "./builder/BuilderHeader";
import LeftToolsPanel from "./builder/LeftToolsPanel";
import PreviewPanel from "./builder/PreviewPanel";
import RightFormPanel from "./builder/RightFormPanel";
import { BuilderProvider } from "./builder/BuilderContext";
import { useBuilderController } from "./builder/hooks/useBuilderController";

export default function Builder() {
  const { contextValue, preparingExport, exportRef, exportCard } =
    useBuilderController();

  return (
    <BuilderProvider value={contextValue}>
      <div className="flex flex-col min-h-screen lg:h-screen bg-canvas overflow-y-auto lg:overflow-hidden text-ink">
        <BuilderHeader />

        <div className="flex flex-col lg:flex-row flex-none lg:flex-1 overflow-visible lg:overflow-hidden min-h-0">
          <LeftToolsPanel />

          <PreviewPanel />

          <RightFormPanel />
        </div>

        {preparingExport && (
          <div
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <CoverLetterCard
              data={exportCard.data}
              bg={exportCard.bg}
              tc={exportCard.tc}
              logoW={exportCard.logoW}
              logoH={exportCard.logoH}
              cardW={exportCard.cardW}
              cardH={exportCard.cardH}
              onCardResize={() => {}}
              handles={false}
              forwardedRef={exportRef}
            />
          </div>
        )}
      </div>
    </BuilderProvider>
  );
}
