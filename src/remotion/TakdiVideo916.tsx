import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import type { RemotionInputProps } from "../types";

const FRAMES_PER_SECTION = 30;

export const TakdiVideo916: React.FC<RemotionInputProps> = ({
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
        padding: 60,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 64,
          fontWeight: 700,
          color: "#111",
          marginBottom: 40,
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
    <div style={{ opacity, flex: 1 }}>
      <div
        style={{
          fontSize: 48,
          fontWeight: 600,
          color: "#222",
          marginBottom: 16,
        }}
      >
        {headline}
      </div>
      <div style={{ fontSize: 32, color: "#555", lineHeight: 1.5 }}>
        {body}
      </div>
    </div>
  );
};
