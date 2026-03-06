/** 결과 페이지 로딩 스켈레톤 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </header>

      {/* Content */}
      <main className="p-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-64 rounded-lg bg-gray-200" />
          <div className="h-48 rounded-lg bg-gray-200" />
          <div className="h-32 rounded-lg bg-gray-200" />
        </div>
      </main>
    </div>
  );
}
