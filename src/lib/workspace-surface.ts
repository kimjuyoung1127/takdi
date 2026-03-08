export const WORKSPACE_SURFACE = {
  page: "bg-[#F4F1EC] text-[#201A17]",
  panel: "border border-[#E5DDD3] bg-[#FBF8F4] shadow-[0_14px_36px_rgba(55,40,30,0.05)]",
  panelStrong: "border border-[#E3D9CE] bg-white shadow-[0_18px_42px_rgba(55,40,30,0.06)]",
  panelMuted: "border border-[#E5DDD3] bg-[#F8F4EF]",
  toolbar: "border border-[#E5DDD3] bg-[#FBF8F4]/95 shadow-[0_12px_32px_rgba(55,40,30,0.05)] backdrop-blur",
  floating: "border border-[#E3D9CE] bg-[#FBF8F4]/95 shadow-[0_16px_32px_rgba(55,40,30,0.06)] backdrop-blur",
  inset: "border border-[#E5DDD3] bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]",
  softInset: "border border-[#E5DDD3] bg-[#F8F4EF]",
} as const;

export const WORKSPACE_TEXT = {
  title: "text-[#201A17]",
  body: "text-[#6F655D]",
  muted: "text-[#9A8B7E]",
  accent: "text-[#D97C67]",
} as const;

export const WORKSPACE_CONTROL = {
  input:
    "border border-[#E4D9CD] bg-white text-[#201A17] placeholder:text-[#9A8B7E] outline-none transition focus:border-[#D6A99C] focus:ring-2 focus:ring-[#F3DDD6]",
  ghostButton:
    "text-[#6F655D] hover:bg-[#F6EFE7] hover:text-[#201A17]",
  subtleButton:
    "border border-[#E5DDD3] bg-white text-[#4D433D] hover:bg-[#F8F4EF] hover:text-[#201A17]",
  accentButton:
    "bg-[#D97C67] text-white shadow-[0_14px_30px_rgba(217,124,103,0.2)] hover:bg-[#CF705A]",
  accentTint:
    "border-[#F1C8BE] bg-[#F8E7E2] text-[#D97C67]",
  darkChip:
    "border-[#D7D3CE] bg-[#2A2522] text-white",
  pill:
    "border border-[#E5DDD3] bg-[#F8F4EF] text-[#6F655D]",
  pillActive:
    "border border-[#F1C8BE] bg-[#F8E7E2] text-[#D97C67] shadow-[0_10px_24px_rgba(217,124,103,0.12)]",
} as const;
