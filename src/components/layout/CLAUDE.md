# layout/
앱 전역 공유 레이아웃 컴포넌트.

## Files
- `app-sidebar.tsx` — w-20 아이콘 사이드바 (Home, Projects, Settings)
- `app-header.tsx` — 검색, 알림, 프로필, "Start New Project" CTA
- `app-layout.tsx` — Sidebar + Header + children 조합 래퍼

## Convention
- 모든 페이지는 `AppLayout`으로 래핑 (에디터 페이지 제외)
- 사이드바 네비는 lucide-react 아이콘 사용
