# Batch 1 - Infra

- [x] 구현 완료
- [x] 자기리뷰 완료
- [x] `npm run typecheck` 완료
- [x] `npm run build` 완료
- [x] 문구 검수 완료

## 작업 내용
- `src/i18n/schema.ts`에 메시지 타입 정의 추가
- `src/i18n/messages/ko.ts`에 한국어 기본 사전 추가
- `src/i18n/provider.tsx`, `src/i18n/use-t.ts`, `src/i18n/get-messages.ts` 추가
- 문자열 조합용 `src/i18n/format.ts` 추가
- `src/app/layout.tsx`에서 `I18nProvider` 연결

## 자기리뷰
- 메시지 사전에 함수형 값을 넣으면 Next 직렬화 제약에 걸리므로 모두 문자열로 정리
- 동적 포맷은 `format.ts`로 분리해 Client Component 직렬화 문제를 제거
- 기본 locale은 `ko`로 고정하고 locale 라우팅은 이번 범위에서 제외
