# Batch 3 - Compose Shared

- [x] 구현 완료
- [x] 자기리뷰 완료
- [x] `npm run typecheck` 완료
- [x] `npm run build` 완료
- [x] 문구 검수 완료

## 작업 내용
- 컴포즈 툴바 버튼, 상태 문구, 저장 시각 라벨 한국어화
- 템플릿 저장 다이얼로그와 이탈 다이얼로그 한국어화
- `BriefBuilder`의 탭, 빈 상태, 액션 라벨 한국어화
- `ComposeShell`의 toast, confirm, 기본 템플릿 이름 한국어화
- 블록 수 표기를 `formatBlocksCount()`로 통일

## 자기리뷰
- 사용자 노출 문구만 바꾸고 기존 편집/저장 흐름은 유지
- `BriefBuilder`에서 남아 있던 `blocks` 영문 표기를 마지막까지 제거
- 토스트와 확인 문구도 하드코딩 대신 메시지 사전 + 포맷 헬퍼로 정리
