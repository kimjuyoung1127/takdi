# services/
비즈니스 로직 서비스 레이어 — API route에서 호출.

## Files
- `brief-parser.ts` — 상품 brief 텍스트 → 섹션 구조 파싱
- `gemini-generator.ts` — Google Gemini 2.5 Flash 텍스트 생성
- `imagen-generator.ts` — Google Imagen 4.0 이미지 생성 (레거시, 미사용)
- `kie-generator.ts` — Kie.ai Nano Banana 2 이미지 생성 (활성)
- `removebg-service.ts` — Kie.ai recraft/remove-background 배경 제거 서비스
- `bgm-analyzer.ts` — BGM 메타데이터 분석 (stub)
- `byoi-validator.ts` — BYOI 이미지 검증 (stub)
- `section-to-blocks.ts` — GenerationResult.sections → Block[] 변환 (카테고리별 설득 구조 정렬)
- `html-exporter.ts` — Block[] → 인라인 스타일 HTML 변환 (쿠팡/네이버 직접 붙여넣기용)

## Convention
- API route → service 1:1 매핑 (route가 service 호출)
- 외부 API 키는 환경변수 또는 요청 body로 전달
- 에러는 throw하여 route에서 catch
