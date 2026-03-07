# lib/
공유 유틸리티 및 인프라 모듈.

## Files
- `prisma.ts` — Prisma 클라이언트 싱글톤
- `api-response.ts` — API 응답 헬퍼 (`jsonOk`, `jsonErr`)
- `api-client.ts` — 클라이언트 사이드 typed fetch wrapper (모든 API 엔드포인트)
- `workspace-guard.ts` — 워크스페이스 권한 검증
- `save-generated-image.ts` — 생성 이미지 파일 저장 유틸
- `block-export.ts` — 블록→이미지 캡처 유틸 (html2canvas-pro, 단일/분할/카드뉴스 캡처, JSZip 분할 내보내기)
- `constants.ts` — 앱 전역 상수 (MODE_LABELS, BLOCK_TYPE_LABELS, PERSUASION_SEQUENCES, PERSUASION_FRAMEWORKS, HOOK_LIBRARY, HOOK_STYLES, TONE_PRESETS, TARGET_AUDIENCE, MODE_NODE_CONFIG, FONT_PRESETS(15종), FlowNodeType, FontPreset, PersuasionFramework, HookStyle, getFontFamily())
- `pipeline-executor.ts` — 동적 파이프라인 실행 엔진 (Kahn 토폴로지 정렬, NODE_EXECUTORS, StepTiming, onPipelineDone)
- `brief-assembler.ts` — 태그 기반 브리프 자동 조립 (BriefTags → 프롬프트 텍스트)
- `design-guardrails.ts` — 디자인 가드레일 규칙 엔진 (텍스트 길이, 인접 중복, 이미지 누락, CTA 검증, autoFixBlock/autoFixAllBlocks 자동 보정)
- `moodboard-presets.ts` — 카테고리별 무드보드 프리셋 (24종, 테마/프롬프트 힌트 매핑)
- `layout-templates.ts` — 검증된 레이아웃 템플릿 (9종: 카테고리 4+기본 2+프레임워크 3, framework 필드, getTemplateByFramework)
- `utils.ts` — shadcn `cn()` 클래스 병합 유틸
- `__tests__/pipeline-executor.test.ts` — 파이프라인 종합 테스트 (35개, vi.mock, 비용 0원)

## Convention
- 순수 유틸리티만 배치 (비즈니스 로직은 `services/`)
- Next.js 서버/클라이언트 구분 주의 (prisma는 서버 전용)
