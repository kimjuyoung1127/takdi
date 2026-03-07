---
name: generation-pipeline-update
description: Update AI generation pipeline while preserving lifecycle contracts.
---

## Trigger
- Use when generation job flow or state transitions change.
- "생성 파이프라인", "generation pipeline", "job 상태"

## Read First
1. `docs/ref/PRD.md`
2. `docs/ref/USER-FLOW.md`
3. `docs/ref/SCHEMA-INDEX.md` — GenerationJob, Pipeline Executor Contract
4. `src/app/api/projects/[id]/generate/route.ts` — 텍스트 생성
5. `src/app/api/projects/[id]/generate-images/route.ts` — 이미지 생성

## Endpoint 목록
| 엔드포인트 | 메서드 | 역할 |
|---|---|---|
| `/api/projects/:id/generate` | POST/GET | 텍스트 생성 (fire → poll) |
| `/api/projects/:id/generate-images` | POST/GET | 이미지 생성 (fire → poll) |
| `/api/projects/:id/remove-bg` | POST/GET | 배경 제거 (fire → poll) |
| `/api/projects/:id/model-compose` | POST/GET | 모델 합성 (fire → poll) |
| `/api/projects/:id/scene-compose` | POST/GET | 장면 합성 (fire → poll) |

## 상태 다이어그램
```
[draft] --POST generate--> [generating] --success--> [generated]
                                        --failure--> [failed]
[generated] --POST export--> [exporting] --success--> [exported]
                                         --failure--> [failed]
```
- `ProjectStatus = draft | generating | generated | failed | exported`
- 상태 전이는 단방향: draft → generating → generated → exported
- failed 상태에서 재시도 가능 (다시 generating으로)

## Do
1. 상태 전이 규칙 보존 — 위 다이어그램과 일치하는지 확인
2. 재시도/실패 동작 명시 — 실패 시 `failed` 상태 + 에러 메시지 저장
3. 출력 형식 보존 — `GenerationResult` 타입과 일치
4. 비동기 패턴 유지 — POST로 시작 (202 + jobId), GET으로 폴링

## Validation
- 상태 전이 규칙이 다이어그램과 일치
- 실패 경로가 복구 가능 (재시도)
- `GenerationResult` 출력 형식 유지
