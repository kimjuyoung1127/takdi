/** ComposeContext - projectId 등 블록 렌더러 공용 컨텍스트 */
"use client";

import { createContext, useContext } from "react";

interface ComposeContextValue {
  projectId: string;
}

const ComposeContext = createContext<ComposeContextValue | null>(null);

export function ComposeProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  return (
    <ComposeContext.Provider value={{ projectId }}>
      {children}
    </ComposeContext.Provider>
  );
}

export function useCompose(): ComposeContextValue {
  const ctx = useContext(ComposeContext);
  if (!ctx) throw new Error("useCompose must be used within ComposeProvider");
  return ctx;
}
