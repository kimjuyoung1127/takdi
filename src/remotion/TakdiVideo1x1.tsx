import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import type { RemotionInputProps } from "../types";

const FRAMES_PER_SECTION = 30;

export const TakdiVideo1x1: React.FC<RemotionInputProps> = ({
  title,
  sections,
}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "sans-serif",
        padding: 48,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 56,
          fontWeight: 700,
          color: "#111",
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        {title || "Takdi Video"}
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <Sequence
          key={section.imageSlot}
          from={15 + i * FRAMES_PER_SECTION}
          durationInFrames={FRAMES_PER_SECTION}
        >
          <SectionSlide
            headline={section.headline}
            body={section.body}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SectionSlide: React.FC<{ headline: string; body: string }> = ({
  headline,
  body,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, textAlign: "center" }}>
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          color: "#222",
          marginBottom: 12,
        }}
      >
        {headline}
      </div>
      <div style={{ fontSize: 28, color: "#555", lineHeight: 1.5 }}>
        {body}
      </div>
    </div>
  );
};
