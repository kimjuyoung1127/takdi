# lib/
공유 유틸리티 및 인프라 모듈.

## Files
- `prisma.ts` — Prisma 클라이언트 싱글톤
- `api-response.ts` — API 응답 헬퍼 (`jsonOk`, `jsonErr`)
- `api-client.ts` — 클라이언트 사이드 typed fetch wrapper (모든 API 엔드포인트)
- `workspace-guard.ts` — 워크스페이스 권한 검증
- `save-generated-image.ts` — 생성 이미지 파일 저장 유틸
- `block-export.ts` — 블록→이미지 캡처 유틸 (html2canvas-pro, 다운로드/파일명 생성)
- `constants.ts` — 앱 전역 상수 (MODE_LABELS, BLOCK_TYPE_LABELS, MODE_NODE_CONFIG, FlowNodeType, NODE_TYPE_LABELS/DESCS)
- `utils.ts` — shadcn `cn()` 클래스 병합 유틸

## Convention
- 순수 유틸리티만 배치 (비즈니스 로직은 `services/`)
- Next.js 서버/클라이언트 구분 주의 (prisma는 서버 전용)
