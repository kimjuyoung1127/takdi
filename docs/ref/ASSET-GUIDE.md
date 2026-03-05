# 에셋 관리 가이드

> **프로젝트:** 탁디장 스튜디오
> **최종 수정:** 2026-03-05

---

## 1. 디렉토리 구조

```
takdi/
├── public/
│   ├── fonts/                          # 커스텀 폰트 파일
│   │   ├── NotoSerifKR-Regular.woff2
│   │   ├── NotoSerifKR-Bold.woff2
│   │   ├── Pretendard-Light.woff2
│   │   ├── Pretendard-Regular.woff2
│   │   ├── Pretendard-Bold.woff2
│   │   └── Pretendard-Black.woff2
│   │
│   └── default-bgm/                   # 내장 BGM 파일
│       ├── calm-flow.mp3
│       ├── upbeat-energy.mp3
│       └── minimal-ambient.mp3
│
├── uploads/                            # 사용자 업로드 파일 (런타임)
│   ├── images/                         # 업로드된 원본 이미지
│   │   └── {projectId}/
│   │       ├── img_001.jpg
│   │       └── img_002.png
│   ├── bgm/                            # 사용자 업로드 BGM
│   │   └── {projectId}/
│   │       └── custom-bgm.mp3
│   └── documents/                      # 업로드된 TXT 파일
│       └── {projectId}/
│           └── plan.txt
│
├── tmp/                                # 임시 파일 (처리 중간 산출물)
│   ├── crops/                          # 스마트 크롭 결과
│   │   └── {projectId}/
│   │       ├── img_001_916.jpg
│   │       ├── img_001_1x1.jpg
│   │       └── img_001_169.jpg
│   └── renders/                        # 렌더링 결과 MP4
│       └── {projectId}/
│           ├── {projectId}_916.mp4
│           ├── {projectId}_1x1.mp4
│           └── {projectId}_169.mp4
│
└── /mnt/nas/takdi-output/              # NAS 마운트 (최종 산출물)
    └── {프로젝트명}_{YYYYMMDD}/
        ├── video_916.mp4
        ├── video_1x1.mp4
        ├── video_169.mp4
        ├── thumbnail.jpg
        ├── script.txt
        └── manifest.json
```

### gitignore 대상

```
uploads/
tmp/
.remotion/
```

---

## 2. 이미지 규격

### 2.1 업로드 이미지

| 항목 | 규격 |
|------|------|
| 최소 해상도 | 1080 x 1080 px (정사각 기준) |
| 권장 해상도 | 1920 x 1920 px 이상 |
| 지원 형식 | JPG, JPEG, PNG, WebP |
| 최대 파일 크기 | 10 MB / 장 |
| 최대 업로드 수 | 프로젝트당 20장 |
| 색공간 | sRGB 권장 |

### 2.2 스마트 크롭 출력

| 비율 | 출력 해상도 | 용도 |
|------|------------|------|
| 9:16 | 1080 x 1920 px | 릴스/숏츠 |
| 1:1 | 1080 x 1080 px | 인스타그램 피드 |
| 16:9 | 1920 x 1080 px | 유튜브 |

### 2.3 이미지 처리 파이프라인

```
원본 이미지 업로드
  → sharp로 메타데이터 읽기 (해상도, 형식 확인)
  → @tensorflow-models/coco-ssd로 피사체 감지
  → smartcrop-sharp로 3비율 스마트 크롭
  → 크롭 결과 tmp/crops/{projectId}/ 에 저장
  → CroppedImage DB 레코드 생성
```

---

## 3. BGM 규격

### 3.1 지원 형식

| 항목 | 규격 |
|------|------|
| 지원 형식 | MP3, WAV |
| 권장 형식 | MP3 (파일 크기 절약) |
| 샘플레이트 | 44100 Hz 권장 |
| 비트레이트 | 128 kbps 이상 (MP3) |
| 최대 파일 크기 | 20 MB |
| 권장 길이 | 15~30초 (숏폼 기준) |

### 3.2 비트 분석 캐시 형식

BGM 등록 시 aubiojs로 비트를 사전 분석하고, `Bgm.beats` 필드에 JSON 문자열로 캐시한다.

```typescript
// BeatMarker 배열 → JSON 문자열로 저장
interface BeatMarker {
  timeSeconds: number;  // 비트 발생 시점 (초 단위, 소수점 3자리)
  strength: number;     // 비트 강도 (0.0 ~ 1.0)
}

// DB 저장 형식 예시
beats: '[{"timeSeconds":0.464,"strength":0.85},{"timeSeconds":0.928,"strength":0.72},...}]'
```

### 3.3 비트 분석 CLI

```bash
# 내장 BGM 사전 분석
npx ts-node scripts/analyze-bgm.ts --input public/default-bgm/calm-flow.mp3

# 출력: JSON 형태의 BeatMarker 배열
```

### 3.4 비트 분석 결과 활용

- `Bgm.bpm` — 분당 비트 수
- `Bgm.beats` — 비트 마커 JSON (슬라이드 비트 스냅에 사용)
- 사용자 업로드 BGM은 업로드 시 자동 분석 → DB 저장

---

## 4. 폰트 규격

### 4.1 Remotion에서 폰트 로드 방법

**방법 1: @remotion/google-fonts (권장)**

```typescript
// src/remotion/Root.tsx 또는 각 컴포지션에서
import { loadFont } from '@remotion/google-fonts/NotoSerifKR';

const { fontFamily } = loadFont();
// delayRender가 자동으로 처리되어 폰트 로딩 완료까지 렌더 대기
```

**방법 2: 커스텀 폰트 (public/fonts/)**

```typescript
// staticFile()로 public/ 디렉토리의 폰트 참조
import { staticFile, continueRender, delayRender } from 'remotion';

const waitForFont = delayRender();
const font = new FontFace('Pretendard', `url(${staticFile('fonts/Pretendard-Regular.woff2')})`);

font.load().then(() => {
  document.fonts.add(font);
  continueRender(waitForFont);
});
```

### 4.2 사용 폰트 목록

| 폰트명 | 용도 | 파일 | 로드 방법 |
|--------|------|------|-----------|
| Noto Serif KR | 감성 템플릿 제목/본문 | Google Fonts | `@remotion/google-fonts` |
| Pretendard | 모던/강렬/미니멀 템플릿 | `public/fonts/` | `staticFile()` + `delayRender` |
| Playfair Display | 영문 액센트 (선택) | Google Fonts | `@remotion/google-fonts` |

### 4.3 Docker 환경 폰트

```dockerfile
# Dockerfile
RUN apt-get install -y fonts-noto-cjk
# → 시스템 레벨에서 한국어 폰트 깨짐 방지
```

---

## 5. NAS 출력 폴더 네이밍 규칙

### 5.1 폴더명 형식

```
{프로젝트명}_{YYYYMMDD}/
```

**예시:**

```
포렌코스_더블에센스_20260305/
├── video_916.mp4
├── video_1x1.mp4
├── video_169.mp4
├── thumbnail.jpg
├── script.txt
└── manifest.json
```

### 5.2 네이밍 규칙 상세

| 항목 | 규칙 |
|------|------|
| 프로젝트명 | 공백 → 언더스코어(`_`), 특수문자 제거 |
| 날짜 | `YYYYMMDD` 형식 (생성 완료 시점 기준) |
| 중복 방지 | 동일 이름 존재 시 `_v2`, `_v3` 접미사 |

### 5.3 NAS 마운트 경로

```
# docker-compose.yml
volumes:
  - /mnt/nas/takdi-output:/app/output

# .env
NAS_OUTPUT_DIR=/app/output
```

### 5.4 산출물 파일명 규칙

| 산출물 | 파일명 | 형식 |
|--------|--------|------|
| 세로 영상 | `video_916.mp4` | MP4 (H.264) |
| 정사각 영상 | `video_1x1.mp4` | MP4 (H.264) |
| 가로 영상 | `video_169.mp4` | MP4 (H.264) |
| 썸네일 | `thumbnail.jpg` | JPEG (1080x1080) |
| 마케팅 스크립트 | `script.txt` | UTF-8 텍스트 |
| 매니페스트 | `manifest.json` | JSON |

### 5.5 manifest.json 구조

```json
{
  "projectName": "포렌코스 더블에센스",
  "createdAt": "2026-03-05T14:30:00Z",
  "template": "감성",
  "bgm": "calm-flow",
  "slideCount": 4,
  "outputs": [
    { "type": "video_916", "file": "video_916.mp4", "sizeBytes": 5242880 },
    { "type": "video_1x1", "file": "video_1x1.mp4", "sizeBytes": 4194304 },
    { "type": "video_169", "file": "video_169.mp4", "sizeBytes": 6291456 },
    { "type": "thumbnail", "file": "thumbnail.jpg", "sizeBytes": 204800 },
    { "type": "script", "file": "script.txt", "sizeBytes": 1024 }
  ]
}
```

---

## 6. 내장 BGM 목록

프로젝트에 기본 제공되는 BGM 3곡. `public/default-bgm/` 디렉토리에 위치.

### 6.1 BGM 카탈로그

| # | 파일명 | 무드 | 예상 BPM | 권장 템플릿 | 설명 |
|---|--------|------|----------|-------------|------|
| 1 | `calm-flow.mp3` | 차분 | ~80 | 감성, 미니멀 | 부드러운 피아노 + 앰비언트. 뷰티/스킨케어 제품에 적합 |
| 2 | `upbeat-energy.mp3` | 활기 | ~120 | 강렬, 모던 | 밝고 에너지 넘치는 일렉트로닉. 식품/스포츠에 적합 |
| 3 | `minimal-ambient.mp3` | 정적 | ~70 | 미니멀 | 최소한의 사운드스케이프. 라이프스타일/인테리어에 적합 |

> **참고:** 위 BGM은 placeholder 정의이며, 실제 파일은 저작권이 확보된 음원으로 대체해야 한다.

### 6.2 DB 시드 데이터

```typescript
// prisma/seed.ts
const bgms = [
  {
    name: 'Calm Flow',
    filePath: 'default-bgm/calm-flow.mp3',
    durationSeconds: 30.0,
    bpm: 80,
    beats: '[]',  // analyze-bgm.ts 실행 후 채워짐
    mood: '차분',
  },
  {
    name: 'Upbeat Energy',
    filePath: 'default-bgm/upbeat-energy.mp3',
    durationSeconds: 30.0,
    bpm: 120,
    beats: '[]',
    mood: '활기',
  },
  {
    name: 'Minimal Ambient',
    filePath: 'default-bgm/minimal-ambient.mp3',
    durationSeconds: 30.0,
    bpm: 70,
    beats: '[]',
    mood: '정적',
  },
];
```

### 6.3 사용자 BGM 업로드 흐름

```
사용자가 MP3/WAV 업로드
  → uploads/bgm/{projectId}/ 에 저장
  → aubiojs로 비트 분석 (자동)
  → Bgm DB 레코드 생성 (beats JSON 포함)
  → 프로젝트에서 선택 가능
```
