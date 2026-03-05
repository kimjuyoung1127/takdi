# Ollama 프롬프트 설계 문서

> **프로젝트:** 탁디장 스튜디오
> **최종 수정:** 2026-03-05
> **LLM:** Ollama REST API (localhost:11434)
> **프롬프트 관리 파일:** `src/services/llm/promptTemplates.ts`

---

## 1. 문서 분석용 프롬프트 (TXT → 슬라이드 자동 구성)

### 1.1 용도

업로드된 기획 문서(TXT)를 분석하여 제품명, 타깃, USP, CTA를 자동 추출하고, 입력된 이미지 수에 맞춰 슬라이드를 자동 구성한다.

**호출 위치:** `src/services/llm/documentAnalyzer.ts`

### 1.2 System Prompt

```
당신은 마케팅 숏폼 영상 제작 전문가입니다.
주어진 기획 문서를 분석하여 숏폼 영상용 슬라이드를 구성합니다.

규칙:
1. 반드시 지정된 JSON 형식으로만 응답하세요.
2. 각 슬라이드의 텍스트는 15자 이내의 짧은 문장으로 작성하세요.
3. 슬라이드 수는 imageCount와 정확히 일치해야 합니다.
4. 첫 슬라이드는 훅(주목끌기), 마지막 슬라이드는 CTA로 구성하세요.
5. suggestedImageRole은 다음 중 선택: hook_cut, product_cut, detail_cut, benefit_cut, model_cut, cta_cut
6. 한국어로 작성하세요.
7. JSON 외의 텍스트를 포함하지 마세요.
```

### 1.3 User Prompt Template

```
아래 기획 문서를 분석하여 숏폼 영상 슬라이드를 구성해주세요.

[기획 문서]
{{documentText}}

[이미지 수]
{{imageCount}}장

위 기획 문서에서 다음을 추출하고, {{imageCount}}개의 슬라이드를 구성해주세요.

JSON 형식:
{
  "productName": "제품명",
  "target": "타깃 고객",
  "usp": "핵심 셀링포인트",
  "cta": "콜투액션 문구",
  "slides": [
    {
      "order": 1,
      "text": "슬라이드 텍스트 (15자 이내)",
      "suggestedImageRole": "hook_cut"
    }
  ]
}
```

**변수 목록:**

| 변수 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `{{documentText}}` | string | 업로드된 TXT 파일 원문 | "포렌코스 더블 에센스..." |
| `{{imageCount}}` | number | 업로드된 이미지 수 | 5 |

### 1.4 Expected Output (JSON)

```typescript
interface DocumentAnalysisResult {
  productName: string;       // "포렌코스 더블 에센스"
  target: string;            // "20-30대 여성, 건조 피부 고민"
  usp: string;               // "더블 히알루론산 72시간 보습"
  cta: string;               // "지금 바로 만나보세요"
  slides: SlideResult[];
}

interface SlideResult {
  order: number;             // 1부터 시작
  text: string;              // 15자 이내 짧은 문장
  suggestedImageRole: string; // hook_cut, product_cut 등
}
```

### 1.5 예시 입출력

**입력 (TXT 문서):**

```
포렌코스 더블 에센스
타깃: 20-30대 여성, 건조 피부
주요 성분: 더블 히알루론산, 세라마이드
효능: 72시간 집중 보습, 피부 장벽 강화
가격: 38,000원 (50ml)
프로모션: 1+1 이벤트 진행 중
```

**이미지 수:** 4장

**출력 (JSON):**

```json
{
  "productName": "포렌코스 더블 에센스",
  "target": "20-30대 여성, 건조 피부 고민",
  "usp": "더블 히알루론산 72시간 보습",
  "cta": "1+1 이벤트, 지금 만나보세요",
  "slides": [
    {
      "order": 1,
      "text": "건조함, 이제 끝!",
      "suggestedImageRole": "hook_cut"
    },
    {
      "order": 2,
      "text": "더블 히알루론산 에센스",
      "suggestedImageRole": "product_cut"
    },
    {
      "order": 3,
      "text": "72시간 집중 보습",
      "suggestedImageRole": "benefit_cut"
    },
    {
      "order": 4,
      "text": "1+1 지금 바로!",
      "suggestedImageRole": "cta_cut"
    }
  ]
}
```

---

## 2. 마케팅 스크립트 생성용 프롬프트

### 2.1 용도

생성된 영상에 첨부할 마케팅 스크립트(SNS 게시용 텍스트)를 자동 생성한다. 훅 + 본문 + 해시태그 구성.

**호출 위치:** `src/services/llm/ollamaClient.ts` (scriptGenerator)

### 2.2 System Prompt

```
당신은 SNS 마케팅 카피라이터입니다.
숏폼 영상과 함께 게시할 마케팅 스크립트를 작성합니다.

규칙:
1. 반드시 [HOOK], [BODY], [HASHTAGS] 3개 섹션으로 구분하세요.
2. [HOOK]: 1줄, 호기심을 자극하는 첫 문장 (이모지 포함 가능)
3. [BODY]: 3-5줄, 제품 장점과 프로모션 정보를 자연스럽게
4. [HASHTAGS]: 관련 해시태그 8-12개 (한국어 + 영어 혼합)
5. 한국어로 작성하세요.
6. 과도한 이모지 사용은 피하세요.
```

### 2.3 User Prompt Template

```
아래 제품 정보로 SNS 마케팅 스크립트를 작성해주세요.

[제품명]
{{productName}}

[타깃 고객]
{{target}}

[핵심 셀링포인트]
{{usp}}

[CTA]
{{cta}}

[슬라이드 텍스트]
{{slideTexts}}

[HOOK], [BODY], [HASHTAGS] 형식으로 작성해주세요.
```

**변수 목록:**

| 변수 | 타입 | 설명 |
|------|------|------|
| `{{productName}}` | string | 제품명 |
| `{{target}}` | string | 타깃 고객 |
| `{{usp}}` | string | 핵심 셀링포인트 |
| `{{cta}}` | string | 콜투액션 문구 |
| `{{slideTexts}}` | string | 슬라이드 텍스트 (줄바꿈 구분) |

### 2.4 Expected Output

```
[HOOK]
{호기심 자극 1줄}

[BODY]
{제품 장점 3-5줄}

[HASHTAGS]
{해시태그 8-12개}
```

**파싱 로직:** `src/services/llm/scriptParser.ts`에서 정규식으로 3개 섹션 분리.

```typescript
interface MarketingScript {
  hook: string;
  body: string;
  hashtags: string[];
}
```

### 2.5 예시 입출력

**입력:**

```
제품명: 포렌코스 더블 에센스
타깃: 20-30대 여성, 건조 피부
USP: 더블 히알루론산 72시간 보습
CTA: 1+1 이벤트, 지금 만나보세요
슬라이드: 건조함 이제 끝! / 더블 히알루론산 에센스 / 72시간 집중 보습 / 1+1 지금 바로!
```

**출력:**

```
[HOOK]
겨울 건조함에 지친 피부, 72시간 보습의 비밀이 궁금하다면?

[BODY]
포렌코스 더블 에센스가 드디어 나왔어요.
더블 히알루론산이 피부 속부터 채워주는 72시간 집중 보습!
세라마이드까지 더해 피부 장벽도 튼튼하게.
지금 1+1 이벤트 중이니까 이 기회 놓치지 마세요.

[HASHTAGS]
#포렌코스 #더블에센스 #히알루론산 #72시간보습 #건조피부 #스킨케어 #뷰티추천 #1+1이벤트 #에센스추천 #FORENCOS
```

---

## 3. 프롬프트 버전 관리 규칙

### 3.1 버전 체계

```
v{MAJOR}.{MINOR}

MAJOR: 출력 형식 변경, 섹션 구조 변경
MINOR: 문구 수정, 규칙 추가/삭제, 파라미터 조정
```

### 3.2 현재 버전

| 프롬프트 | 현재 버전 | 최종 수정일 |
|----------|-----------|------------|
| 문서 분석 (Document Analysis) | v1.0 | 2026-03-05 |
| 마케팅 스크립트 (Marketing Script) | v1.0 | 2026-03-05 |

### 3.3 관리 원칙

1. **프롬프트는 코드로 관리:** `src/services/llm/promptTemplates.ts`에서 상수로 정의
2. **버전 상수 포함:** 각 프롬프트 상수에 버전 주석 기재
3. **변경 시 테스트:** 프롬프트 수정 후 반드시 3개 이상의 샘플 데이터로 출력 검증
4. **이전 버전 보존:** 주석으로 이전 버전 히스토리 기록 (최소 1개 이전 버전)
5. **출력 파싱과 결합:** 프롬프트 형식 변경 시 `scriptParser.ts` 파싱 로직도 함께 수정

### 3.4 코드 구조 예시

```typescript
// src/services/llm/promptTemplates.ts

// ===== 문서 분석 프롬프트 v1.0 (2026-03-05) =====
export const DOCUMENT_ANALYSIS_SYSTEM = `당신은 마케팅 숏폼 영상 제작 전문가입니다...`;
export const DOCUMENT_ANALYSIS_USER = (documentText: string, imageCount: number) =>
  `아래 기획 문서를 분석하여...`;

// ===== 마케팅 스크립트 프롬프트 v1.0 (2026-03-05) =====
export const MARKETING_SCRIPT_SYSTEM = `당신은 SNS 마케팅 카피라이터입니다...`;
export const MARKETING_SCRIPT_USER = (params: ScriptParams) =>
  `아래 제품 정보로 SNS 마케팅 스크립트를...`;
```

### 3.5 Ollama API 호출 형식

```typescript
// src/services/llm/ollamaClient.ts
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3.1',  // 또는 사용 가능한 모델
    system: DOCUMENT_ANALYSIS_SYSTEM,
    prompt: DOCUMENT_ANALYSIS_USER(documentText, imageCount),
    stream: false,
    format: 'json',     // JSON 모드 강제 (문서 분석용)
  }),
});
```

### 3.6 에러 핸들링

- **Ollama 미설치/다운:** 헬스체크 UI에 상태 표시, graceful fallback
- **JSON 파싱 실패:** 최대 2회 재시도, 실패 시 사용자에게 수동 입력 안내
- **슬라이드 수 불일치:** imageCount와 slides 배열 길이 비교, 불일치 시 재요청
- **타임아웃:** 15초 이내 응답 목표, 초과 시 타임아웃 에러
