# 탁디장 스튜디오 - 제품 요구사항 명세 (PRD)

> **버전:** 2.1.0
> **최종 수정:** 2026-03-05

---

## 1. 표준 응답 형식

모든 API route는 아래 형식을 따른다.

```typescript
// 성공
{
  success: true,
  data: T
}

// 실패
{
  success: false,
  data: null,
  error: {
    code: string,      // 예: "PROJECT_NOT_FOUND"
    message: string    // 사람이 읽을 수 있는 설명
  }
}
```

HTTP 상태 코드:
| 코드 | 의미 |
|------|------|
| 200 | 성공 |
| 201 | 리소스 생성 성공 |
| 400 | 잘못된 요청 (유효성 실패) |
| 404 | 리소스 없음 |
| 422 | 처리 불가 (비즈니스 로직 실패) |
| 500 | 서버 내부 오류 |
| 503 | 외부 서비스 불가 (Ollama 다운 등) |

---

## 2. API 계약

### 2.1 GET /api/health

서버 및 외부 서비스 상태 확인.

**Request:** 없음

**Response 200:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "db": "connected",
    "ollama": "connected",
    "nas": "mounted",
    "remotionBundle": "cached",
    "uptime": 3600
  }
}
```

**Response 503:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Ollama 서비스에 연결할 수 없습니다"
  }
}
```

---

### 2.2 GET /api/projects

프로젝트 목록 조회.

**Query Params:**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| page | number | 1 | 페이지 번호 |
| limit | number | 20 | 페이지당 개수 |
| status | string | - | 필터 (draft, analyzing, reviewed, processing, completed, failed) |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "clx1abc...",
        "name": "봄 신제품 캠페인",
        "productName": "로즈 세럼",
        "status": "completed",
        "templateId": "tpl_001",
        "bgmId": "bgm_001",
        "imageCount": 5,
        "createdAt": "2026-03-05T09:00:00Z",
        "updatedAt": "2026-03-05T09:05:00Z"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

### POST /api/projects

프로젝트 생성.

**Request (multipart/form-data):**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | O | 프로젝트명 |
| templateId | string | O | 템플릿 ID |
| bgmId | string | O | BGM ID (내장 선택 시) |
| bgmFile | File | X | 사용자 BGM 파일 (MP3/WAV) |
| documentFile | File | X | 기획 TXT 파일 |
| documentText | string | X | 기획 텍스트 직접 입력 (documentFile과 택1) |
| images | File[] | O | 이미지 파일 목록 |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "clx1abc...",
    "name": "봄 신제품 캠페인",
    "status": "draft",
    "imageCount": 5,
    "createdAt": "2026-03-05T09:00:00Z"
  }
}
```

**에러:**
| 코드 | 상황 |
|------|------|
| VALIDATION_ERROR | name 누락, 이미지 0장, documentFile과 documentText 모두 없음 |
| TEMPLATE_NOT_FOUND | 존재하지 않는 templateId |
| BGM_NOT_FOUND | 존재하지 않는 bgmId |
| FILE_TOO_LARGE | 이미지 또는 BGM 파일 크기 초과 |
| UNSUPPORTED_FORMAT | 지원하지 않는 파일 형식 |

---

### 2.3 POST /api/analyze

기획 텍스트를 Ollama LLM으로 분석하여 슬라이드 자동 조합.

**Request:**
```json
{
  "projectId": "clx1abc...",
  "documentText": "제품명: 로즈 세럼\n타깃: 20-30대 여성\n...",
  "imageCount": 5
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "productName": "로즈 세럼",
    "cta": "지금 바로 만나보세요",
    "slides": [
      {
        "order": 0,
        "text": "장미 추출물로 완성한 촉촉한 하루",
        "suggestedImageRole": "main_cut",
        "suggestedImageIndex": 0
      },
      {
        "order": 1,
        "text": "건조한 피부 고민, 이제 끝",
        "suggestedImageRole": "problem_cut",
        "suggestedImageIndex": 1
      }
    ]
  }
}
```

**에러:**
| 코드 | 상황 |
|------|------|
| PROJECT_NOT_FOUND | 존재하지 않는 projectId |
| OLLAMA_UNAVAILABLE | Ollama 서비스 미연결 |
| ANALYSIS_FAILED | LLM 분석 실패 (파싱 오류 등) |
| EMPTY_DOCUMENT | 기획 텍스트가 비어있음 |

---

### 2.4 POST /api/render

Remotion 렌더링 트리거. 3종 영상을 순차/병렬로 렌더링.

**Request:**
```json
{
  "projectId": "clx1abc...",
  "aspectRatios": ["9:16", "1:1", "16:9"]
}
```

**Response 202:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      { "id": "job_001", "type": "render_916", "status": "pending" },
      { "id": "job_002", "type": "render_1x1", "status": "pending" },
      { "id": "job_003", "type": "render_169", "status": "pending" }
    ]
  }
}
```

**에러:**
| 코드 | 상황 |
|------|------|
| PROJECT_NOT_FOUND | 존재하지 않는 projectId |
| PROJECT_NOT_REVIEWED | 프로젝트가 reviewed 상태가 아님 |
| BUNDLE_NOT_FOUND | Remotion 번들 미생성 |
| RENDER_IN_PROGRESS | 이미 렌더링 진행 중 |
| CROP_NOT_READY | 이미지 크롭이 완료되지 않음 |

---

### 2.5 POST /api/llm

Ollama를 통한 마케팅 스크립트 생성.

**Request:**
```json
{
  "projectId": "clx1abc...",
  "type": "marketing_script"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "script": "...",
    "generatedAt": "2026-03-05T09:03:00Z"
  }
}
```

**에러:**
| 코드 | 상황 |
|------|------|
| PROJECT_NOT_FOUND | 존재하지 않는 projectId |
| OLLAMA_UNAVAILABLE | Ollama 서비스 미연결 |
| GENERATION_FAILED | LLM 생성 실패 |

---

### 2.6 GET /api/bgm

BGM 목록 조회.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "bgms": [
      {
        "id": "bgm_001",
        "name": "Soft Morning",
        "filePath": "/default-bgm/soft-morning.mp3",
        "durationSeconds": 30.5,
        "bpm": 120,
        "mood": "감성"
      }
    ]
  }
}
```

### GET /api/bgm/[id]/beats

특정 BGM의 비트 분석 결과 조회.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "bgmId": "bgm_001",
    "bpm": 120,
    "beats": [
      { "timeSeconds": 0.5, "strength": 0.9 },
      { "timeSeconds": 1.0, "strength": 0.7 }
    ]
  }
}
```

**에러:**
| 코드 | 상황 |
|------|------|
| BGM_NOT_FOUND | 존재하지 않는 BGM ID |
| BEATS_NOT_ANALYZED | 비트 분석이 아직 완료되지 않음 |

---

### 2.7 GET /api/templates

템플릿 목록 조회.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "tpl_001",
        "name": "감성 로즈",
        "mood": "감성",
        "previewImagePath": "/templates/preview-001.jpg",
        "fontFamily": "Noto Serif KR",
        "textAnimation": "fade_serif",
        "transitionStyle": "fade"
      }
    ]
  }
}
```

---

### 2.8 GET /api/jobs

작업 목록 조회.

**Query Params:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| projectId | string | 특정 프로젝트의 작업만 조회 |
| status | string | 상태 필터 (pending, running, completed, failed) |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_001",
        "projectId": "clx1abc...",
        "type": "render_916",
        "status": "running",
        "progress": 45,
        "startedAt": "2026-03-05T09:01:00Z",
        "completedAt": null
      }
    ]
  }
}
```

### GET /api/jobs/[id]/status (SSE)

작업 진행률 실시간 스트리밍.

**Response:** `text/event-stream`
```
data: {"jobId":"job_001","status":"running","progress":45}

data: {"jobId":"job_001","status":"running","progress":70}

data: {"jobId":"job_001","status":"completed","progress":100,"outputPath":"/outputs/..."}
```

---

## 3. 기능별 수락 기준 (AC)

### AC-001: 프로젝트 생성

```
Given: 사용자가 프로젝트 생성 폼에 접근
When: 프로젝트명 + TXT 파일(또는 텍스트 직접 입력) + 이미지 3장 이상 + 템플릿 + BGM 선택 후 제출
Then:
  - 프로젝트가 "draft" 상태로 DB에 저장
  - 이미지가 서버에 업로드되고 ProjectImage 레코드 생성
  - 기획 텍스트가 documentText 필드에 저장
  - 프로젝트 상세 페이지로 리다이렉트
```

### AC-002: AI 텍스트 분석 (슬라이드 자동 조합)

```
Given: draft 상태의 프로젝트가 존재하고 documentText와 이미지가 있음
When: "AI 분석" 버튼 클릭
Then:
  - 프로젝트 상태가 "analyzing"으로 변경
  - Ollama가 TXT에서 제품명, USP, CTA 추출
  - 이미지 수에 맞춰 슬라이드 자동 생성
  - 각 슬라이드에 텍스트와 이미지 역할 매칭
  - 결과가 slidesJson에 저장
  - 분석 완료 후 SlideEditor에 결과 표시
  - 전체 소요 시간 10초 이내
```

### AC-003: 슬라이드 편집 및 확인

```
Given: AI 분석이 완료된 프로젝트
When: 사용자가 SlideEditor에서 텍스트 수정, 이미지 순서 변경, 슬라이드 추가/삭제 수행
Then:
  - 변경사항이 실시간으로 Remotion Player 미리보기에 반영
  - "확인" 클릭 시 프로젝트 상태가 "reviewed"로 변경
  - slidesJson이 최종 편집 내용으로 업데이트
```

### AC-004: 이미지 스마트 크롭

```
Given: reviewed 상태의 프로젝트
When: "전체 생성" 클릭 (또는 파이프라인 자동 실행)
Then:
  - 각 이미지를 3비율(9:16, 1:1, 16:9)로 스마트 크롭
  - 피사체(사람/제품) 중심 유지
  - N이미지 x 3비율 병렬 처리
  - CroppedImage 레코드 생성
  - 전체 크롭 소요 시간 10초 이내
```

### AC-005: 영상 렌더링

```
Given: 이미지 크롭이 완료된 프로젝트
When: 렌더링 작업 시작
Then:
  - 3종 영상(9:16, 1:1, 16:9) 렌더링
  - 슬라이드 수는 입력 이미지/텍스트에 따라 유동적
  - 각 슬라이드 전환이 BGM 비트에 동기화
  - 템플릿별 텍스트 애니메이션 적용
  - SSE로 클라이언트에 진행률 실시간 전송
  - 유효한 MP4 파일 생성
  - 3영상 합계 렌더 시간 60초 이내
```

### AC-006: 마케팅 스크립트 생성

```
Given: 프로젝트에 기획 텍스트와 분석 결과가 있음
When: 파이프라인에서 스크립트 생성 단계 실행
Then:
  - Ollama가 마케팅 스크립트 생성
  - Output 레코드에 type="script"로 저장
  - 소요 시간 15초 이내
```

### AC-007: 썸네일 생성

```
Given: 프로젝트에 크롭된 이미지가 있음
When: 파이프라인에서 썸네일 생성 단계 실행
Then:
  - sharp로 대표 이미지 기반 썸네일 합성
  - Output 레코드에 type="thumbnail"로 저장
  - 소요 시간 2초 이내
```

### AC-008: NAS 전달

```
Given: 모든 산출물(영상 3종 + 썸네일 + 스크립트)이 생성됨
When: 파이프라인에서 NAS 전달 단계 실행
Then:
  - NAS에 "{프로젝트명}_{YYYYMMDD}/" 폴더 생성
  - 5개 산출물 + manifest.json 복사
  - 프로젝트 상태 "completed"로 변경
  - 소요 시간 3초 이내
```

### AC-009: 전체 파이프라인

```
Given: 사용자가 슬라이드를 확인/수정 완료한 프로젝트
When: "전체 생성" 클릭
Then:
  - 이미지 크롭 → 영상 렌더 + 썸네일 + 스크립트(병렬) → NAS 전달 순서로 실행
  - 프로젝트 상태: reviewed → processing → completed
  - 실패 시: failed + errorMessage 기록
  - 전체 소요 시간 120초(2분) 이내
```

---

## 4. 에러 케이스 목록

### 4.1 입력 관련

| 코드 | 상황 | HTTP | 대응 |
|------|------|------|------|
| VALIDATION_ERROR | 필수 필드 누락 | 400 | 유효성 메시지 표시 |
| FILE_TOO_LARGE | 파일 크기 초과 (이미지 50MB, BGM 100MB) | 400 | 크기 제한 안내 |
| UNSUPPORTED_FORMAT | 지원하지 않는 파일 형식 | 400 | 지원 형식 안내 |
| EMPTY_DOCUMENT | 기획 텍스트 없음 | 400 | TXT 업로드 또는 직접 입력 안내 |
| NO_IMAGES | 이미지 0장 업로드 | 400 | 최소 1장 필요 안내 |

### 4.2 리소스 관련

| 코드 | 상황 | HTTP | 대응 |
|------|------|------|------|
| PROJECT_NOT_FOUND | 존재하지 않는 프로젝트 | 404 | - |
| TEMPLATE_NOT_FOUND | 존재하지 않는 템플릿 | 404 | - |
| BGM_NOT_FOUND | 존재하지 않는 BGM | 404 | - |
| JOB_NOT_FOUND | 존재하지 않는 작업 | 404 | - |

### 4.3 상태 관련

| 코드 | 상황 | HTTP | 대응 |
|------|------|------|------|
| PROJECT_NOT_REVIEWED | 분석/확인 없이 렌더 시도 | 422 | AI 분석 먼저 실행 안내 |
| RENDER_IN_PROGRESS | 이미 렌더링 중 | 422 | 진행 중 작업 완료 대기 안내 |
| CROP_NOT_READY | 크롭 미완료 상태에서 렌더 시도 | 422 | 크롭 완료 대기 |
| ANALYSIS_IN_PROGRESS | 분석 중 중복 요청 | 422 | 분석 완료 대기 |

### 4.4 외부 서비스 관련

| 코드 | 상황 | HTTP | 대응 |
|------|------|------|------|
| OLLAMA_UNAVAILABLE | Ollama 서비스 미연결 | 503 | 대시보드에 상태 표시, 재시도 |
| NAS_UNREACHABLE | NAS 마운트 안됨 | 503 | 로컬 temp에 보관, 수동 복사 안내 |
| BUNDLE_NOT_FOUND | Remotion 번들 미생성 | 500 | bundle-remotion 스크립트 실행 안내 |

### 4.5 처리 실패

| 코드 | 상황 | HTTP | 대응 |
|------|------|------|------|
| ANALYSIS_FAILED | LLM 분석 파싱 실패 | 500 | 재시도 버튼, 수동 입력 대안 |
| GENERATION_FAILED | LLM 스크립트 생성 실패 | 500 | 재시도 |
| CROP_FAILED | 이미지 크롭 실패 | 500 | 해당 이미지 확인 안내 |
| RENDER_FAILED | Remotion 렌더 실패 | 500 | 로그 확인, 재시도 |
| THUMBNAIL_FAILED | 썸네일 생성 실패 | 500 | 재시도 |
| PIPELINE_FAILED | 파이프라인 전체 실패 | 500 | 실패 단계부터 재시도 |
