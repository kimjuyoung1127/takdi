# app/
Next.js App Router 루트 — 페이지 + API routes.

## Structure
- `layout.tsx` — 루트 레이아웃 (globals.css, 폰트)
- `page.tsx` — Home 화면 (모드 선택 + 최근 프로젝트)
- `globals.css` — Tailwind CSS + shadcn 디자인 토큰
- `loading.tsx` — 홈 로딩 스켈레톤
- `projects/[id]/editor/page.tsx` — 노드 에디터 페이지 (dynamic import)
- `projects/[id]/editor/loading.tsx` — 에디터 로딩 스켈레톤
- `projects/[id]/preview/page.tsx` — Remotion 프리뷰 페이지 (dynamic import)
- `projects/[id]/preview/loading.tsx` — 프리뷰 로딩 스켈레톤
- `projects/[id]/compose/page.tsx` — 블록 에디터 페이지 (dynamic import)
- `projects/[id]/compose/loading.tsx` — 블록 에디터 로딩 스켈레톤
- `projects/[id]/result/page.tsx` — 결과 프리뷰 페이지
- `projects/[id]/result/loading.tsx` — 결과 로딩 스켈레톤
- `api/projects/` — 프로젝트 CRUD API
- `api/projects/[id]/blocks/` — 블록 문서 CRUD (GET/PUT)
- `api/projects/[id]/generate/` — 텍스트 생성 (비동기)
- `api/projects/[id]/generate-images/` — 이미지 생성
- `api/projects/[id]/remotion/render/` — 렌더링 (비동기)
- `api/projects/[id]/remove-bg/` — 배경 제거 (비동기, Kie.ai recraft/remove-background)
- `api/projects/[id]/model-compose/` — 모델 합성 (비동기, Nano Banana 2 + image_input)
- `api/projects/[id]/scene-compose/` — AI 배경 합성 (비동기, Nano Banana 2 + imageUrl + scenePrompt)
- `api/projects/[id]/export/` — 내보내기 (비동기)

## Convention
- 페이지는 서버 컴포넌트, 인터랙션은 클라이언트 컴포넌트 분리
- 무거운 클라이언트 컴포넌트는 `next/dynamic` + `ssr: false`로 lazy load
- 모든 페이지 디렉토리에 `loading.tsx` 스켈레톤 필수
- API route 마지막 세그먼트 = 컴포넌트 폴더명 (1:1 매핑)
- 비동기 API: POST → 202 + jobId, GET → 폴링
