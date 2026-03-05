# services/
비즈니스 로직 서비스 레이어 — API route에서 호출.

## Files
- `brief-parser.ts` — 상품 brief 텍스트 → 섹션 구조 파싱
- `gemini-generator.ts` — Google Gemini 2.5 Flash 텍스트 생성
- `imagen-generator.ts` — Google Imagen 4.0 이미지 생성
- `bgm-analyzer.ts` — BGM 메타데이터 분석 (stub)
- `byoi-validator.ts` — BYOI 이미지 검증 (stub)

## Convention
- API route → service 1:1 매핑 (route가 service 호출)
- 외부 API 키는 환경변수 또는 요청 body로 전달
- 에러는 throw하여 route에서 catch
