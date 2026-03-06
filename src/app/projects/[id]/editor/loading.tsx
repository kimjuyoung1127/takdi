/** 노드 에디터 로딩 스켈레톤 — 3패널 레이아웃 */
export default function Loading() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Palette */}
      <div className="w-64 animate-pulse border-r border-gray-100 bg-white/80 p-5">
        <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
        <div className="mb-4 h-3 w-36 rounded bg-gray-100" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 animate-pulse p-8">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-8">
          <div className="h-20 w-36 rounded-xl bg-gray-200" />
          <div className="h-0.5 w-16 bg-gray-200" />
          <div className="h-20 w-36 rounded-xl bg-gray-200" />
          <div className="h-0.5 w-16 bg-gray-200" />
          <div className="h-20 w-36 rounded-xl bg-gray-200" />
        </div>
      </div>

      {/* Properties */}
      <div className="w-80 animate-pulse border-l border-gray-100 bg-white p-5">
        <div className="mb-4 h-4 w-24 rounded bg-gray-200" />
        <div className="space-y-3">
          <div className="h-8 rounded bg-gray-100" />
          <div className="h-8 rounded bg-gray-100" />
          <div className="h-8 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
