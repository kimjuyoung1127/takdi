/** 홈 페이지 로딩 스켈레톤 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl animate-pulse">
        {/* Title */}
        <div className="mb-2 h-8 w-48 rounded bg-gray-200" />
        <div className="mb-6 h-4 w-64 rounded bg-gray-200" />

        {/* Mode cards */}
        <div className="flex gap-4 pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex min-w-45 flex-col items-center gap-3 rounded-3xl bg-white p-6 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
          ))}
        </div>

        {/* Recent projects */}
        <div className="mt-10">
          <div className="mb-4 h-6 w-32 rounded bg-gray-200" />
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-gray-50 px-6 py-4 last:border-0">
                <div className="h-10 w-10 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="mt-1 h-3 w-48 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
