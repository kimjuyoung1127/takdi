"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { TakdiVideo916 } from "@/remotion/TakdiVideo916";
import { TakdiVideo1x1 } from "@/remotion/TakdiVideo1x1";
import { TakdiVideo169 } from "@/remotion/TakdiVideo169";
import type { RemotionInputProps, CompositionId } from "@/types";

const COMPOSITIONS: Record<
  CompositionId,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.FC<any>;
    width: number;
    height: number;
    label: string;
  }
> = {
  TakdiVideo_916: {
    component: TakdiVideo916,
    width: 1080,
    height: 1920,
    label: "9:16",
  },
  TakdiVideo_1x1: {
    component: TakdiVideo1x1,
    width: 1080,
    height: 1080,
    label: "1:1",
  },
  TakdiVideo_169: {
    component: TakdiVideo169,
    width: 1920,
    height: 1080,
    label: "16:9",
  },
};

const TEMPLATE_TO_COMPOSITION: Record<string, CompositionId> = {
  "9:16": "TakdiVideo_916",
  "1:1": "TakdiVideo_1x1",
  "16:9": "TakdiVideo_169",
};

interface RemotionPreviewProps {
  initialCompositionId: CompositionId;
  inputProps: RemotionInputProps;
}

export function RemotionPreview({
  initialCompositionId,
  inputProps,
}: RemotionPreviewProps) {
  const [compositionId, setCompositionId] =
    useState<CompositionId>(initialCompositionId);

  const comp = COMPOSITIONS[compositionId];

  return (
    <div>
      {/* Ratio toggle */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          justifyContent: "center",
        }}
      >
        {Object.entries(TEMPLATE_TO_COMPOSITION).map(([label, id]) => (
          <button
            key={id}
            onClick={() => setCompositionId(id)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: compositionId === id ? "#111" : "#fff",
              color: compositionId === id ? "#fff" : "#111",
              cursor: "pointer",
              fontWeight: compositionId === id ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Player */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxHeight: "70vh",
        }}
      >
        <Player
          component={comp.component}
          inputProps={{
            ...inputProps,
            templateKey: comp.label,
          }}
          durationInFrames={150}
          compositionWidth={comp.width}
          compositionHeight={comp.height}
          fps={30}
          controls
          loop
          style={{
            width: "100%",
            maxWidth: comp.width > comp.height ? "800px" : "400px",
          }}
        />
      </div>
    </div>
  );
}
