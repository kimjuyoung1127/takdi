/** 프리뷰 페이지 로딩 스켈레톤 */
export default function Loading() {
  return (
    <main className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-16 animate-pulse rounded-xl bg-gray-200" />
      </div>

      {/* Player placeholder */}
      <div className="mx-auto max-w-2xl">
        <div className="aspect-[9/16] animate-pulse rounded-xl bg-gray-200" />
      </div>

      {/* Info */}
      <div className="mt-6 h-4 w-48 animate-pulse rounded bg-gray-200" />
    </main>
  );
}
