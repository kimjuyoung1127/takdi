/** Compose 에디터 로딩 스켈레톤 — 3패널 레이아웃 */
export default function Loading() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-7 w-14 animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-14 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Palette */}
        <div className="w-56 animate-pulse border-r border-gray-200 bg-white p-4">
          <div className="mb-3 h-4 w-20 rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex h-16 flex-col items-center justify-center rounded-lg bg-gray-100">
                <div className="h-5 w-5 rounded bg-gray-200" />
                <div className="mt-1 h-3 w-10 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8">
          <div className="mx-auto max-w-3xl animate-pulse space-y-4">
            <div className="h-48 rounded-lg bg-gray-200" />
            <div className="h-32 rounded-lg bg-gray-200" />
            <div className="h-24 rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Properties */}
        <div className="w-72 animate-pulse border-l border-gray-200 bg-white p-4">
          <div className="mb-4 h-4 w-16 rounded bg-gray-200" />
          <div className="space-y-3">
            <div className="h-8 rounded bg-gray-100" />
            <div className="h-8 rounded bg-gray-100" />
            <div className="h-8 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
