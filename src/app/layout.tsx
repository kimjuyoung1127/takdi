import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
