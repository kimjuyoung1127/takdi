# home/
Home 화면(`/`) 전용 컴포넌트.

## Files
- `mode-card.tsx` — 모드 선택 카드 (클릭 시 프로젝트 생성 → 에디터 이동)
- `recent-projects.tsx` — 최근 프로젝트 목록 + 빈 상태 처리

## Convention
- `mode-card`는 클라이언트 컴포넌트 (onClick 핸들러)
- `recent-projects`는 서버 컴포넌트 (props로 데이터 수신)
