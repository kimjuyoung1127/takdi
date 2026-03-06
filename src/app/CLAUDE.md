# app/
Next.js App Router 루트 — 페이지 + API routes.

## Structure
- `layout.tsx` — 루트 레이아웃 (globals.css, 폰트)
- `page.tsx` — Home 화면 (모드 선택 + 최근 프로젝트)
- `globals.css` — Tailwind CSS + shadcn 디자인 토큰
- `projects/[id]/editor/page.tsx` — 노드 에디터 페이지
- `projects/[id]/preview/page.tsx` — Remotion 프리뷰 페이지
- `projects/[id]/compose/page.tsx` — 블록 에디터 페이지
- `projects/[id]/result/page.tsx` — 결과 프리뷰 페이지
- `api/projects/` — 프로젝트 CRUD API
- `api/projects/[id]/blocks/` — 블록 문서 CRUD (GET/PUT)
- `api/projects/[id]/generate/` — 텍스트 생성 (비동기)
- `api/projects/[id]/generate-images/` — 이미지 생성
- `api/projects/[id]/remotion/render/` — 렌더링 (비동기)
- `api/projects/[id]/export/` — 내보내기 (비동기)

## Convention
- 페이지는 서버 컴포넌트, 인터랙션은 클라이언트 컴포넌트 분리
- API route 마지막 세그먼트 = 컴포넌트 폴더명 (1:1 매핑)
- 비동기 API: POST → 202 + jobId, GET → 폴링
