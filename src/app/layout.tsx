/** Takdi Studio 루트 레이아웃 — globals.css + 기본 body 스타일 적용 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Takdi Studio",
  description: "AI-powered e-commerce detail page generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
