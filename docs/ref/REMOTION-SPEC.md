# Remotion 영상 생성 상세 스펙

> **프로젝트:** 탁디장 스튜디오
> **최종 수정:** 2026-03-05
> **Remotion 버전:** 4.x
> **Player 버전:** @remotion/player 4.x

---

## 1. Composition 구조

### 1.1 TakdiVideo (3비율 공용 컴포지션)

`TakdiVideo`는 9:16, 1:1, 16:9 세 가지 비율에서 동일하게 사용되는 단일 컴포지션이다. 비율에 따라 `width`/`height`만 달라지고, 내부 로직은 공유한다.

**파일 위치:** `src/services/video/compositions/TakdiVideo.tsx`

**InputProps 인터페이스:**

```typescript
interface TakdiVideoProps {
  slides: SlideInput[];        // 유동적 슬라이드 배열
  template: TemplateConfig;    // 템플릿 설정 (색상, 폰트, 애니메이션)
  bgmUrl: string;              // BGM 파일 경로
  bgmBeats: BeatMarker[];      // 비트 마커 배열
  productName: string;         // 브랜드 워터마크용
  cta: string;                 // CTA 엔딩 텍스트
}

interface SlideInput {
  imageUrl: string;
  text: string;
  role: string;  // main_cut, problem_cut, detail_cut, model_cut 등
}
```

### 1.2 레이어 구조 (렌더링 순서)

```
┌─────────────────────────────────┐
│  레이어 5: CTA 엔딩 (마지막 2초)    │  ← CtaOverlay.tsx
│  레이어 4: 브랜드 워터마크           │  ← BrandWatermark.tsx
│  레이어 3: 하단 자막 바              │  ← SubtitleBar.tsx
│  레이어 2: 텍스트 오버레이           │  ← TextOverlay.tsx (템플릿별 애니메이션)
│  레이어 1: 이미지 슬라이드쇼 (Ken Burns) │  ← ImageSlide.tsx
│  오디오: BGM                        │  ← <Audio> (volume: 0.7)
└─────────────────────────────────┘
```

**공유 컴포넌트 경로:** `src/services/video/compositions/shared/`

| 컴포넌트 | 파일 | 역할 |
|----------|------|------|
| ImageSlide | `ImageSlide.tsx` | Ken Burns 줌(1.0→1.08) + 전환(페이드 인/아웃 0.3초) |
| TextOverlay | `TextOverlay.tsx` | 템플릿별 4종 텍스트 애니메이션 |
| SubtitleBar | `SubtitleBar.tsx` | 하단 자막 바 (슬라이드별 텍스트 표시) |
| BrandWatermark | `BrandWatermark.tsx` | 제품명 워터마크 (항상 표시) |
| CtaOverlay | `CtaOverlay.tsx` | 마지막 2초 CTA 메시지 표시 |

---

## 2. 컴포지션 등록

### 2.1 Root.tsx 등록 (3개 컴포지션)

**파일 위치:** `src/remotion/Root.tsx`

```typescript
import { Composition } from 'remotion';
import { TakdiVideo } from '@/services/video/compositions/TakdiVideo';

export const Root = () => (
  <>
    {/* 9:16 세로 (릴스/숏츠) */}
    <Composition
      id="TakdiVideo_916"
      component={TakdiVideo}
      width={1080}
      height={1920}
      fps={30}
      defaultProps={defaultProps}
      calculateMetadata={calculateDynamicDuration}
    />

    {/* 1:1 정사각형 (인스타그램 피드) */}
    <Composition
      id="TakdiVideo_1x1"
      component={TakdiVideo}
      width={1080}
      height={1080}
      fps={30}
      defaultProps={defaultProps}
      calculateMetadata={calculateDynamicDuration}
    />

    {/* 16:9 가로 (유튜브) */}
    <Composition
      id="TakdiVideo_169"
      component={TakdiVideo}
      width={1920}
      height={1080}
      fps={30}
      defaultProps={defaultProps}
      calculateMetadata={calculateDynamicDuration}
    />
  </>
);
```

### 2.2 Composition ID 네이밍 규칙

| 비율 | Composition ID | 해상도 | 용도 |
|------|---------------|--------|------|
| 9:16 | `TakdiVideo_916` | 1080x1920 | 릴스, 숏츠, 틱톡 |
| 1:1 | `TakdiVideo_1x1` | 1080x1080 | 인스타그램 피드 |
| 16:9 | `TakdiVideo_169` | 1920x1080 | 유튜브, 웹사이트 |

### 2.3 엔트리 포인트

**파일 위치:** `src/remotion/index.ts`

```typescript
import { registerRoot } from 'remotion';
import { Root } from './Root';
registerRoot(Root);
```

### 2.4 calculateDynamicDuration

`calculateMetadata` 콜백으로 슬라이드 수와 텍스트 길이에 따라 영상 총 길이를 동적으로 결정한다.

```typescript
const calculateDynamicDuration = ({ props }) => {
  const totalSeconds = props.slides.length * 3.75; // 기본 ~15초 (4슬라이드 기준)
  return {
    durationInFrames: Math.round(totalSeconds * 30),
    fps: 30,
  };
};
```

---

## 3. 사전 번들링

### 3.1 핵심 제약

`@remotion/bundler`는 Webpack을 포함하므로 Next.js API route 내에서 직접 호출할 수 없다. 반드시 별도 스크립트로 사전 번들링해야 한다.

### 3.2 번들링 스크립트

**파일 위치:** `scripts/bundle-remotion.ts`

```typescript
import { bundle } from '@remotion/bundler';

const bundlePath = await bundle({
  entryPoint: './src/remotion/index.ts',
  outDir: './.remotion/bundle',
  enableCaching: true,
  publicDir: './public',
});

// bundlePath를 파일에 저장 → API route에서 읽어서 사용
```

### 3.3 번들 캐시 전략

```
앱 시작 시 1회 bundle() 실행
  → .remotion/bundle/ 디렉토리에 저장
  → bundlePath를 파일에 기록 (src/lib/remotionBundle.ts가 관리)
  → API route에서 readBundlePath()로 읽어서 renderMedia()에 전달
  → 소스 변경 없으면 캐시 재사용 (enableCaching: true)
```

### 3.4 API Route에서 재사용

```typescript
// src/lib/remotionBundle.ts
export async function readBundlePath(): Promise<string> {
  // .remotion/bundle/ 경로를 파일에서 읽어 반환
}
```

```typescript
// src/app/api/render/route.ts
const bundlePath = await readBundlePath(); // 사전 빌드된 번들 경로

const composition = await selectComposition({
  serveUrl: bundlePath,
  id: compositionId,
  inputProps,
});

await renderMedia({
  composition,
  serveUrl: bundlePath,
  codec: 'h264',
  outputLocation: outputPath,
  inputProps,
  concurrency: 4,
});
```

---

## 4. @remotion/player: 브라우저 미리보기 통합

### 4.1 VideoPreview 컴포넌트

**파일 위치:** `src/components/project/VideoPreview.tsx`

```typescript
'use client';
import { Player } from '@remotion/player';
import { TakdiVideo } from '@/services/video/compositions/TakdiVideo';

export const VideoPreview: React.FC<{
  props: TakdiVideoProps;
  aspectRatio: '9:16' | '1:1' | '16:9';
}> = ({ props, aspectRatio }) => {
  const dimensions = {
    '9:16': { width: 1080, height: 1920 },
    '1:1':  { width: 1080, height: 1080 },
    '16:9': { width: 1920, height: 1080 },
  }[aspectRatio];

  return (
    <Player
      component={TakdiVideo}
      inputProps={props}
      compositionWidth={dimensions.width}
      compositionHeight={dimensions.height}
      durationInFrames={15 * 30}
      fps={30}
      loop
      autoPlay={false}
      controls
      style={{ width: '100%', maxHeight: '400px' }}
    />
  );
};
```

### 4.2 통합 위치

- 프로젝트 생성 3단계 폼의 **Step 3 (SlideEditor)**에서 사용
- 텍스트 수정, 이미지 순서 변경 시 Player가 실시간 업데이트
- `'use client'` 필수 (SSR 방지)
- 필요 시 `dynamic import`로 lazy loading 적용

### 4.3 SSR 에러 방지

```typescript
import dynamic from 'next/dynamic';

const VideoPreview = dynamic(
  () => import('@/components/project/VideoPreview'),
  { ssr: false }
);
```

---

## 5. 슬라이드 시스템: 유동적 슬라이드

### 5.1 자동 결정 로직

입력된 이미지/텍스트 수에 따라 슬라이드 수가 자동 결정된다. 고정 구조 없이 유동적으로 구성한다.

```
입력 이미지 3장 → 3슬라이드 (각 ~5.0초 = 총 ~15초)
입력 이미지 4장 → 4슬라이드 (각 ~3.75초 = 총 ~15초)
입력 이미지 5장 → 5슬라이드 (각 ~3.0초 = 총 ~15초)
입력 이미지 6장 → 6슬라이드 (각 ~2.5초 = 총 ~15초)
```

### 5.2 슬라이드 구성 원칙

- 각 슬라이드 = 이미지 1장 + 텍스트 1개
- Ollama가 TXT 문서를 분석하여 이미지별 텍스트를 자동 배분
- 텍스트 가독성(읽기 시간) 기반으로 슬라이드별 Duration 미세 조정
- 비트 스냅으로 슬라이드 전환 시점 최종 보정

### 5.3 Duration 계산 흐름

```
1. 텍스트 기반 자연 듀레이션 계산 (가독성)
2. 총 시간에 맞게 비례 스케일링
3. BGM 비트에 스냅
4. 마지막 슬라이드를 총 프레임에 맞춤
```

---

## 6. 자막 타이밍 알고리즘

### 6.1 가독성 기반 Duration 계산

**파일 위치:** `src/services/video/subtitleTiming.ts`

**상수:**

| 파라미터 | 값 | 설명 |
|----------|-----|------|
| `CHARS_PER_SECOND_KO` | 4.5 | 한국어 초당 읽기 속도 |
| `CHARS_PER_SECOND_EN` | 12 | 영어 초당 읽기 속도 |
| `MIN_SLIDE_SECONDS` | 1.5 | 최소 슬라이드 표시 시간 |
| `MAX_SLIDE_SECONDS` | 5.0 | 최대 슬라이드 표시 시간 |

### 6.2 계산 공식

```typescript
// 한국어 글자 수 추출 (유니코드 범위: AC00-D7AF)
const koChars = (text.match(/[\uAC00-\uD7AF]/g) || []).length;
const otherChars = text.length - koChars;

// 읽기 시간 = 한국어 시간 + 영어 시간 + 여유 0.5초
const readSec = koChars / CHARS_PER_SECOND_KO + otherChars / CHARS_PER_SECOND_EN + 0.5;

// 클램프 (1.5초 ~ 5.0초)
const duration = Math.max(MIN_SLIDE_SECONDS, Math.min(MAX_SLIDE_SECONDS, readSec));
```

### 6.3 비례 스케일링

자연 듀레이션 합계가 총 영상 시간과 다를 경우, 비례적으로 스케일링한다.

```typescript
const totalNatural = naturalDurations.reduce((a, b) => a + b, 0);
const totalSeconds = totalFrames / fps;
const scaled = naturalDurations.map(d => (d / totalNatural) * totalSeconds);
```

---

## 7. 비트 스냅 알고리즘

### 7.1 개요

슬라이드 전환 시점을 BGM의 비트(강박)에 맞추어 영상의 리듬감을 높인다.

### 7.2 허용 범위

- **스냅 허용 오차:** ±0.3초
- 슬라이드 경계가 비트 위치에서 0.3초 이내이면 비트 시점으로 이동
- 0.3초 초과 시 원래 위치 유지

### 7.3 알고리즘 상세

```typescript
function snapToBeat(time: number, beats: BeatMarker[], threshold: number): number {
  let nearest = time;
  let minDist = threshold;

  for (const beat of beats) {
    const dist = Math.abs(beat.timeSeconds - time);
    if (dist < minDist) {
      minDist = dist;
      nearest = beat.timeSeconds;
    }
  }

  return nearest;
}
```

### 7.4 비례 배분 보정

비트 스냅 후 슬라이드 간 시간 배분이 왜곡될 수 있으므로:

1. 각 슬라이드 경계를 순차적으로 스냅
2. 마지막 슬라이드는 총 프레임에 강제 맞춤
3. `beatAligned: boolean` 플래그로 스냅 여부 추적

```typescript
interface SlideTiming {
  startFrame: number;
  durationFrames: number;
  beatAligned: boolean;   // 비트에 스냅되었는지 여부
}
```

### 7.5 비트 데이터 소스

- **비트 분석:** aubiojs (WASM 기반 오디오 분석)
- **캐시:** BGM 등록 시 사전 분석, `Bgm.beats` 필드에 JSON 저장
- **분석 CLI:** `scripts/analyze-bgm.ts`

```typescript
interface BeatMarker {
  timeSeconds: number;  // 비트 발생 시점 (초)
  strength: number;     // 비트 강도 (0~1)
}
```

---

## 8. 서버사이드 렌더링 (renderMedia)

### 8.1 렌더링 흐름

```
Next.js API Route (POST /api/render)
  → readBundlePath() (사전 빌드된 번들)
  → selectComposition(serveUrl, id, inputProps)
  → renderMedia(composition, codec:'h264', outputLocation)
  → MP4 파일 출력
  → SSE로 클라이언트에 진행률 전송
```

### 8.2 Composition ID 매핑

```typescript
const compositionId = `TakdiVideo_${aspectRatio.replace(':', 'x')}`;
// '9:16' → 'TakdiVideo_9x16' ... 는 아님, 실제 매핑:
// '916' → 'TakdiVideo_916'
// '1x1' → 'TakdiVideo_1x1'
// '169' → 'TakdiVideo_169'
```

### 8.3 renderMedia 옵션

```typescript
await renderMedia({
  composition,
  serveUrl: bundlePath,
  codec: 'h264',
  outputLocation: `./tmp/renders/${projectId}_${aspectRatio}.mp4`,
  inputProps,
  concurrency: 4,
  chromiumOptions: {
    headless: true,
    args: ['--disable-dev-shm-usage'],
  },
  onProgress: ({ progress }) => {
    updateJobProgress(projectId, aspectRatio, Math.round(progress * 100));
  },
});
```

---

## 9. 성능 최적화

| 항목 | 방법 | 상세 |
|------|------|------|
| 번들 캐시 | 앱 시작 시 1회 `bundle()` | `.remotion/bundle/` 경로 재사용, `enableCaching: true` |
| 렌더 동시성 | `concurrency: 4` | CPU 코어 절반 사용 |
| Docker shm | `shm_size: 2gb` | Chromium 공유 메모리 부족 방지 (필수) |
| 한글 폰트 | `@remotion/google-fonts/NotoSerifKR` | `delayRender` 자동 처리 |
| 계산 캐시 | `useMemo` | 슬라이드 타이밍, 비트 데이터 등 비싼 계산 메모이제이션 |
| 최대 동시 렌더 | `MAX_CONCURRENT_RENDERS=2` | 하드웨어에 따라 조절 가능 |
| Chromium 옵션 | `--disable-dev-shm-usage` | Docker 환경 안정성 |

### 9.1 성능 예산

| 단계 | 목표 시간 |
|------|-----------|
| Remotion 번들 (캐시 히트) | ~0초 |
| 3영상 렌더 (순차 2개씩) | ~60초 |
| 렌더당 단일 | ~20초 |
| **전체 렌더 파이프라인** | **~75초** |

### 9.2 Docker 설정 필수사항

```yaml
# docker-compose.yml
services:
  app:
    shm_size: '2gb'                    # Chromium 필수
    environment:
      - MAX_CONCURRENT_RENDERS=2
```

### 9.3 .remotion/ 디렉토리

```
.remotion/           # 빌드 산출물 (.gitignore에 포함)
  └── bundle/        # 사전 번들링 결과물
```
