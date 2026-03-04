# 탁디장 스튜디오 — Master Implementation Plan v2.1

> **앱 제목:** 탁디장 스튜디오
> **버전:** 2.1.0
> **최종 수정:** 2026-03-05
> **브랜딩:** 따뜻한 핑크/베이지/테라코타 감성 톤 (FORENCOS 레퍼런스)

---

## 0. 프로젝트 개요

**기획 문서(TXT) + 이미지 다수 업로드 → AI가 자동 조합 → 3종 숏폼 영상 + 썸네일 + 마케팅 스크립트**를 자동 생성하는 완전 독립형 사내 렌더링 엔진.

### 핵심 사용자 플로우
```
[Step 1] 업로드
  - 기획 문서 (TXT): 제품 정보, 카피, 성분, CTA 등
  - 이미지 여러 장: 모델컷, 제품컷, 디테일컷 등 (순서 자유)
  - 템플릿 & BGM 선택

[Step 2] AI 자동 분석 (Ollama 텍스트 LLM)
  - TXT 파일 읽기 → 제품명, 타깃, USP, CTA 등 자동 분류
  - 이미지 수에 맞춰 슬라이드 수 자동 결정
  - 각 슬라이드에 텍스트 자동 배분
  - 이미지 ↔ 텍스트 최적 매칭

[Step 3] 사용자 확인/수정
  - AI가 조합한 결과를 화면에 표시
  - 텍스트 수정, 이미지 순서 변경, 슬라이드 추가/삭제 가능
  - Remotion Player로 실시간 미리보기

[Step 4] 생성
  - "전체 생성" 클릭
  - 3종 영상 + 썸네일 + 마케팅 스크립트 자동 출력
  - NAS에 자동 저장
```

### 핵심 결정사항
- **텍스트 입력:** TXT 파일 업로드 또는 텍스트 영역에 직접 복붙 (OCR 불필요)
- **이미지 입력:** 이미지 다수 드래그앤드롭 업로드
- **BGM 입력:** 내장 BGM 라이브러리 선택 또는 사용자 BGM 파일 업로드 (MP3/WAV)
- **AI 역할:** Ollama 텍스트 LLM이 기획 텍스트를 파싱/분류/슬라이드 배분 (비전 모델 불필요)
- **확인 단계:** AI 조합 결과를 사용자가 확인/수정 후 생성
- **개발 환경:** Windows → Mac Mini Docker 배포
- **DB:** SQLite via Prisma (운영비 0원)
- **인증:** 불필요 (사내 폐쇄망)
- **슬라이드 구성:** 유동적 (입력 이미지/텍스트 수에 따라 자동 결정)
- **텍스트 애니메이션:** 템플릿별 다른 스타일
- **Remotion Player:** 대시보드에 실시간 미리보기 포함
- **BGM 비트:** 사전 분석 + DB 캐시
- **문서 관리:** TaillogToss 핵심 구조 이식

---

## 1. 기술 스택

| 항목 | 기술 | 버전 | pin |
|------|------|------|-----|
| Framework | Next.js (App Router) | 14.2.x | yes |
| Language | TypeScript (strict=true) | 5.x | yes |
| Styling | Tailwind CSS | 3.4.x | yes |
| State | Zustand | ^4.5.0 | yes |
| DB | SQLite via Prisma | 5.x | yes |
| Video Render | Remotion | 4.x | yes |
| Video Preview | @remotion/player | 4.x | yes |
| Image | sharp + smartcrop-sharp | latest | no |
| Object Detection | @tensorflow-models/coco-ssd + tfjs | 4.x | no |
| Audio Analysis | aubiojs (WASM) | latest | no |
| LLM | Ollama REST API | localhost:11434 | - |
| Fonts | @remotion/google-fonts (Noto Serif KR, Pretendard) | - | - |
| Form | React Hook Form + Zod | latest | no |
| Icons | Lucide React | latest | no |
| Container | Docker + docker-compose | - | - |
| CI/CD | GitHub Actions | - | - |

---

## 2. 문서 관리 구조 (TaillogToss 이식)

```
takdi/
├── CLAUDE.md                        # AI 에이전트 운영 지침 (루트 허브)
├── AGENTS.md                        # 시스템 스펙 원본
├── PLAN.md                          # 이 파일 — 마스터 구현 계획
├── docs/
│   ├── ref/
│   │   ├── PRD.md                   # 제품 요구사항 상세 명세
│   │   ├── ARCHITECTURE.md          # 시스템 아키텍처 다이어그램
│   │   ├── REMOTION-SPEC.md         # Remotion 영상 생성 상세 스펙
│   │   └── SCHEMA-INDEX.md          # DB 스키마 인덱스
│   └── status/
│       ├── PROJECT-STATUS.md        # 실시간 진행 현황
│       └── FEATURE-MATRIX.md        # 기능별 구현 상태 추적
```

### CLAUDE.md 역할
- 7대 실행 규칙 정의
- 기술 스택 요약
- 우선순위 로드맵 링크
- docs/ 경로 인덱스

### FEATURE-MATRIX.md 형식
| ID | 기능 | 상태 | 담당 | 비고 |
|----|------|------|------|------|
| CORE-001 | 프로젝트 CRUD | Not Started | - | - |
| CORE-002 | TXT 업로드 + 파싱 | Not Started | - | - |
| CORE-003 | 이미지 다수 업로드 | Not Started | - | - |
| AI-001 | TXT→슬라이드 자동 분류 (Ollama) | Not Started | - | - |
| AI-002 | 이미지↔텍스트 매칭 | Not Started | - | - |
| AI-003 | 마케팅 스크립트 생성 | Not Started | - | - |
| IMG-001 | 스마트 크롭 (3비율) | Not Started | - | - |
| VID-001 | Remotion 컴포지션 | Not Started | - | - |
| VID-002 | 비트 스냅 엔진 | Not Started | - | - |
| VID-003 | Remotion Player 미리보기 | Not Started | - | - |
| OUT-001 | 썸네일 생성 | Not Started | - | - |
| OUT-002 | NAS 전달 | Not Started | - | - |
| ...

상태: `Not Started` → `In Progress` → `Done` / `Blocked` / `Deferred`

---

## 3. 디자인 시스템

### 3.1 컬러 팔레트 (FORENCOS 레퍼런스)

```
primary:     #C4756E    — 더스티 로즈 (메인 액센트)
secondary:   #D4A59A    — 소프트 피치
background:  #F2E6E0    — 웜 크림
surface:     #FFFFFF    — 화이트
text:        #2D2420    — 다크 브라운
text-muted:  #8B7D76    — 웜 그레이
accent:      #8B4E47    — 딥 테라코타
success:     #6B8F71    — 세이지 그린
error:       #C44D4D    — 소프트 레드
```

### 3.2 타이포그래피
- **제목:** Noto Serif KR (감성, 세리프)
- **본문:** Pretendard (가독성, 산세리프)
- **영문 액센트:** Playfair Display (고급스러운 느낌)

### 3.3 UI 컴포넌트 (src/components/ui/)
- `Button` — variants: primary(더스티로즈), secondary(아웃라인), ghost, danger / sizes: sm, md, lg / loading
- `Card` — 라운드 코너(12px), 소프트 쉐도우, 웜 크림 배경
- `Input` — 라벨 + 에러 메시지, 포커스 시 더스티로즈 보더
- `Select` — 커스텀 드롭다운
- `FileUpload` — 드래그앤드롭, 프리뷰 썸네일, 역할 라벨
- `ProgressBar` — 그라데이션 (더스티로즈→피치)
- `Badge` — pending=gray, running=피치, completed=세이지, failed=레드
- `Modal` — 오버레이 + 애니메이션

---

## 4. Remotion 영상 생성 상세 스펙

### 4.1 아키텍처

```
Next.js API Route (trigger)
  → Remotion Bundle (사전 빌드, 캐시)
    → selectComposition(id, inputProps)
      → renderMedia(composition, codec:'h264', outputLocation)
        → MP4 출력

브라우저 미리보기:
  @remotion/player → <Player component={} inputProps={} />
```

**핵심 제약:** `@remotion/bundler`는 Webpack 포함이므로 API route 내에서 호출 불가.
→ **해결:** 앱 시작 시 또는 별도 스크립트로 사전 번들링, 번들 경로를 캐시하여 재사용.

```typescript
// scripts/bundle-remotion.ts — 앱 시작 시 1회 실행
import { bundle } from '@remotion/bundler';
const bundlePath = await bundle({
  entryPoint: './src/remotion/index.ts',
  outDir: './.remotion/bundle',
  enableCaching: true,
  publicDir: './public',
});
// bundlePath를 파일에 저장 → API route에서 읽어서 사용
```

### 4.2 Composition 등록

```typescript
// src/remotion/Root.tsx
import { Composition } from 'remotion';

export const Root = () => (
  <>
    <Composition
      id="TakdiVideo_916"
      component={TakdiVideo}
      width={1080} height={1920} fps={30}
      defaultProps={defaultProps}
      calculateMetadata={calculateDynamicDuration}
    />
    <Composition
      id="TakdiVideo_1x1"
      component={TakdiVideo}
      width={1080} height={1080} fps={30}
      defaultProps={defaultProps}
      calculateMetadata={calculateDynamicDuration}
    />
    <Composition
      id="TakdiVideo_169"
      component={TakdiVideo}
      width={1920} height={1080} fps={30}
      defaultProps={defaultProps}
      calculateMetadata={calculateDynamicDuration}
    />
  </>
);
```

### 4.3 유동적 슬라이드 시스템

입력된 이미지/텍스트 수에 따라 슬라이드 수가 자동 결정됩니다.

```typescript
// src/types/composition.ts
export interface SlideInput {
  imageUrl: string;
  text: string;
  role: string;        // main_cut, problem_cut, etc.
}

export interface TakdiVideoProps {
  slides: SlideInput[];
  template: TemplateConfig;
  bgmUrl: string;
  bgmBeats: BeatMarker[];
  productName: string;
  cta: string;
}
```

**슬라이드 자동 생성 로직:**
```
입력 이미지 3장 → 3슬라이드 (각 ~5초 = 총 ~15초)
입력 이미지 4장 → 4슬라이드 (각 ~3.75초 = 총 ~15초)
입력 이미지 6장 → 6슬라이드 (각 ~2.5초 = 총 ~15초)

각 슬라이드 = 이미지 + 해당 텍스트
텍스트 가독성 기반으로 Duration 미세 조정
비트 스냅으로 최종 보정
```

### 4.4 TakdiVideo 메인 컴포지션 구조

```typescript
// src/services/video/compositions/TakdiVideo.tsx
const TakdiVideo: React.FC<TakdiVideoProps> = ({
  slides, template, bgmUrl, bgmBeats, productName, cta
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. 슬라이드 타이밍 계산 (텍스트 기반 + 비트 스냅)
  const slideTimings = useMemo(
    () => calculateSlideTimings(slides, bgmBeats, fps, durationInFrames),
    [slides, bgmBeats, fps, durationInFrames]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: template.bgColor }}>
      {/* 레이어 1: 이미지 슬라이드쇼 */}
      {slideTimings.map((timing, i) => (
        <Sequence key={i} from={timing.startFrame} durationInFrames={timing.durationFrames}>
          <ImageSlide
            src={slides[i].imageUrl}
            transition={template.transitionStyle}
            kenBurns={true}
          />
        </Sequence>
      ))}

      {/* 레이어 2: 텍스트 오버레이 (템플릿별 다른 애니메이션) */}
      {slideTimings.map((timing, i) => (
        <Sequence key={`text-${i}`} from={timing.startFrame} durationInFrames={timing.durationFrames}>
          <TextOverlay
            text={slides[i].text}
            animation={template.textAnimation}
            fontFamily={template.fontFamily}
            color={template.textColor}
          />
        </Sequence>
      ))}

      {/* 레이어 3: 하단 자막 바 */}
      <SubtitleBar slideTimings={slideTimings} slides={slides} />

      {/* 레이어 4: 브랜드 워터마크 */}
      <BrandWatermark productName={productName} />

      {/* 레이어 5: CTA 엔딩 (마지막 2초) */}
      <Sequence from={durationInFrames - fps * 2}>
        <CtaOverlay cta={cta} template={template} />
      </Sequence>

      {/* 오디오 */}
      <Audio src={staticFile(bgmUrl)} volume={0.7} />
    </AbsoluteFill>
  );
};
```

### 4.5 템플릿별 텍스트 애니메이션

```typescript
// src/services/video/compositions/shared/TextOverlay.tsx
type TextAnimation = 'fade_serif' | 'slide_modern' | 'scale_bold' | 'simple_minimal';

const animationMap: Record<TextAnimation, (frame: number, fps: number) => React.CSSProperties> = {

  // 감성 템플릿: 부드러운 페이드인 + 약간의 스케일
  fade_serif: (frame, fps) => ({
    opacity: interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `scale(${interpolate(frame, [0, fps * 0.5], [0.95, 1], { extrapolateRight: 'clamp' })})`,
    fontFamily: 'Noto Serif KR',
  }),

  // 모던 템플릿: 슬라이드인 + 클린한 모션
  slide_modern: (frame, fps) => ({
    opacity: interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateY(${interpolate(frame, [0, fps * 0.3], [30, 0], { extrapolateRight: 'clamp' })}px)`,
    fontFamily: 'Pretendard',
  }),

  // 강렬 템플릿: 빠른 스케일업 + 바운스
  scale_bold: (frame, fps) => {
    const s = spring({ frame, fps, config: { mass: 0.5, damping: 12, stiffness: 200 } });
    return {
      opacity: 1,
      transform: `scale(${s})`,
      fontFamily: 'Pretendard',
      fontWeight: 900,
      textShadow: '0 4px 20px rgba(0,0,0,0.4)',
    };
  },

  // 미니멀 템플릿: 단순 페이드 + 정적 텍스트
  simple_minimal: (frame, fps) => ({
    opacity: interpolate(frame, [0, fps * 0.8], [0, 1], { extrapolateRight: 'clamp' }),
    fontFamily: 'Pretendard',
    fontWeight: 300,
  }),
};
```

### 4.6 이미지 전환 (Ken Burns + Transition)

```typescript
// src/services/video/compositions/shared/ImageSlide.tsx
const ImageSlide: React.FC<{
  src: string;
  transition: TransitionStyle;
  kenBurns: boolean;
}> = ({ src, transition, kenBurns }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Ken Burns: 느린 줌인 효과 (1.0 → 1.08)
  const scale = kenBurns
    ? interpolate(frame, [0, durationInFrames], [1, 1.08])
    : 1;

  // 전환 인: 첫 0.3초
  const enterOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 전환 아웃: 마지막 0.3초
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - fps * 0.3, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ opacity: Math.min(enterOpacity, exitOpacity) }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
```

### 4.7 자막 타이밍 + 비트 스냅

```typescript
// src/services/video/subtitleTiming.ts
const CHARS_PER_SECOND_KO = 4.5;
const CHARS_PER_SECOND_EN = 12;
const MIN_SLIDE_SECONDS = 1.5;
const MAX_SLIDE_SECONDS = 5.0;

export function calculateSlideTimings(
  slides: SlideInput[],
  beats: BeatMarker[],
  fps: number,
  totalFrames: number
): SlideTiming[] {
  // Step 1: 텍스트 기반 자연 듀레이션 계산
  const naturalDurations = slides.map(s => {
    const koChars = (s.text.match(/[\uAC00-\uD7AF]/g) || []).length;
    const otherChars = s.text.length - koChars;
    const readSec = koChars / CHARS_PER_SECOND_KO + otherChars / CHARS_PER_SECOND_EN;
    return Math.max(MIN_SLIDE_SECONDS, Math.min(MAX_SLIDE_SECONDS, readSec + 0.5));
  });

  // Step 2: 총 시간에 맞게 비례 스케일링
  const totalNatural = naturalDurations.reduce((a, b) => a + b, 0);
  const totalSeconds = totalFrames / fps;
  const scaled = naturalDurations.map(d => (d / totalNatural) * totalSeconds);

  // Step 3: 비트 스냅 — 슬라이드 경계를 가장 가까운 비트로 조정
  const timings: SlideTiming[] = [];
  let cursor = 0;
  for (let i = 0; i < slides.length; i++) {
    const naturalEnd = cursor + scaled[i];
    const snappedEnd = snapToBeat(naturalEnd, beats, 0.3); // ±0.3초 허용
    const duration = snappedEnd - cursor;

    timings.push({
      startFrame: Math.round(cursor * fps),
      durationFrames: Math.round(duration * fps),
      beatAligned: snappedEnd !== naturalEnd,
    });
    cursor = snappedEnd;
  }

  // Step 4: 마지막 슬라이드를 총 프레임에 맞춤
  const last = timings[timings.length - 1];
  last.durationFrames = totalFrames - last.startFrame;

  return timings;
}

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

### 4.8 Remotion Player 미리보기 (브라우저)

```typescript
// src/components/project/VideoPreview.tsx
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

대시보드의 프로젝트 생성 폼에서 텍스트/이미지 변경 시 Player가 실시간 업데이트됨.

### 4.9 서버사이드 렌더링 (API Route)

```typescript
// src/app/api/render/route.ts
import { renderMedia, selectComposition } from '@remotion/renderer';
import { readBundlePath } from '@/lib/remotionBundle';

export async function POST(req: Request) {
  const { projectId, aspectRatio } = await req.json();

  const bundlePath = await readBundlePath(); // 사전 빌드된 번들 경로
  const compositionId = `TakdiVideo_${aspectRatio.replace(':', 'x')}`;
  const inputProps = await buildInputProps(projectId);

  const composition = await selectComposition({
    serveUrl: bundlePath,
    id: compositionId,
    inputProps,
  });

  const outputPath = `./tmp/renders/${projectId}_${aspectRatio}.mp4`;

  await renderMedia({
    composition,
    serveUrl: bundlePath,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    concurrency: 4,
    chromiumOptions: {
      headless: true,
      args: ['--disable-dev-shm-usage'],
    },
    onProgress: ({ progress }) => {
      // SSE로 클라이언트에 진행률 전송
      updateJobProgress(projectId, aspectRatio, Math.round(progress * 100));
    },
  });

  return Response.json({ success: true, path: outputPath });
}
```

### 4.10 성능 최적화

| 최적화 | 방법 |
|--------|------|
| 번들 캐시 | 앱 시작 시 1회 bundle(), `.remotion/bundle/` 경로 재사용 |
| 동시성 | `concurrency: 4` (CPU 코어 절반) |
| Docker shm | `shm_size: 2gb` 설정 필수 |
| 한글 폰트 | `@remotion/google-fonts/NotoSerifKR` 사용 (delayRender 자동) |
| useMemo | 슬라이드 타이밍, 비트 데이터 등 비싼 계산 캐시 |
| 순차 렌더 옵션 | `MAX_CONCURRENT_RENDERS=2` (하드웨어에 따라 조절) |

---

## 5. 파일 구조

```
takdi/
├── CLAUDE.md
├── AGENTS.md
├── PLAN.md
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── .env.example
├── Dockerfile
├── docker-compose.yml
│
├── .github/workflows/ci.yml
│
├── docs/
│   ├── ref/
│   │   ├── PRD.md
│   │   ├── ARCHITECTURE.md
│   │   ├── REMOTION-SPEC.md
│   │   └── SCHEMA-INDEX.md
│   └── status/
│       ├── PROJECT-STATUS.md
│       └── FEATURE-MATRIX.md
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── fonts/
│   └── default-bgm/
│
├── scripts/
│   ├── bundle-remotion.ts          # Remotion 사전 번들링
│   ├── setup-dev.sh                # 개발환경 셋업 (ffmpeg, Ollama 등)
│   ├── deploy-mac.sh               # Mac Mini 배포
│   └── analyze-bgm.ts              # BGM 비트 사전 분석 CLI
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # 대시보드 홈
│   │   ├── globals.css
│   │   ├── projects/
│   │   │   ├── page.tsx            # 프로젝트 목록
│   │   │   ├── new/page.tsx        # 프로젝트 생성 + 미리보기
│   │   │   └── [id]/page.tsx       # 프로젝트 상세 + 결과
│   │   └── api/
│   │       ├── health/route.ts
│   │       ├── projects/route.ts
│   │       ├── jobs/
│   │       │   ├── route.ts
│   │       │   └── [id]/status/route.ts    # SSE 진행률
│   │       ├── analyze/route.ts             # TXT 분석 → 슬라이드 자동 조합
│   │       ├── render/route.ts              # Remotion 렌더 트리거
│   │       ├── llm/route.ts                 # Ollama 마케팅 스크립트 생성
│   │       ├── bgm/
│   │       │   ├── route.ts
│   │       │   └── [id]/beats/route.ts      # 비트 분석 결과
│   │       └── templates/route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── project/
│   │   │   ├── ProjectForm.tsx          # TXT + 이미지 업로드 폼
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── SlideEditor.tsx          # AI 조합 결과 확인/수정 에디터
│   │   │   └── VideoPreview.tsx         # Remotion Player 미리보기
│   │   ├── template/
│   │   │   └── TemplateSelector.tsx
│   │   ├── bgm/
│   │   │   └── BgmSelector.tsx
│   │   └── job/
│   │       ├── JobQueue.tsx
│   │       └── JobProgressBar.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                        # Prisma client singleton
│   │   ├── store.ts                     # Zustand store
│   │   ├── remotionBundle.ts            # 번들 경로 캐시 관리
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── services/
│   │   ├── pipeline.ts                  # 전체 파이프라인 오케스트레이터
│   │   ├── queue/
│   │   │   └── inMemoryQueue.ts         # Redis 없이 인메모리 큐
│   │   ├── image/
│   │   │   ├── smartCrop.ts
│   │   │   ├── objectDetect.ts
│   │   │   └── imageOptimize.ts
│   │   ├── video/
│   │   │   ├── renderWorker.ts          # renderMedia 호출
│   │   │   ├── subtitleTiming.ts        # 가독성 기반 타이밍
│   │   │   └── compositions/
│   │   │       ├── TakdiVideo.tsx       # 메인 컴포지션 (3비율 공용)
│   │   │       └── shared/
│   │   │           ├── TextOverlay.tsx  # 템플릿별 텍스트 애니메이션
│   │   │           ├── ImageSlide.tsx   # Ken Burns + 전환
│   │   │           ├── SubtitleBar.tsx  # 하단 자막
│   │   │           ├── BrandWatermark.tsx
│   │   │           └── CtaOverlay.tsx   # CTA 엔딩
│   │   ├── audio/
│   │   │   ├── beatAnalyzer.ts          # aubiojs 비트 감지
│   │   │   └── beatSnapEngine.ts        # 슬라이드→비트 스냅
│   │   ├── llm/
│   │   │   ├── ollamaClient.ts          # Ollama REST 클라이언트
│   │   │   ├── documentAnalyzer.ts      # TXT → 슬라이드 자동 분류/배분
│   │   │   ├── promptTemplates.ts       # 분석용 + 스크립트용 프롬프트
│   │   │   └── scriptParser.ts          # LLM 출력 파서
│   │   ├── thumbnail/
│   │   │   └── thumbnailGenerator.ts    # sharp 기반 합성
│   │   └── output/
│   │       ├── deliveryManager.ts       # NAS 복사
│   │       └── manifestWriter.ts        # JSON manifest
│   │
│   ├── types/
│   │   ├── project.ts
│   │   ├── job.ts
│   │   ├── template.ts
│   │   ├── bgm.ts
│   │   ├── composition.ts
│   │   └── output.ts
│   │
│   └── remotion/
│       ├── index.ts                     # registerRoot
│       └── Root.tsx                     # Composition 등록
│
├── tests/
│   ├── unit/
│   │   └── services/
│   │       ├── subtitleTiming.test.ts
│   │       ├── beatSnapEngine.test.ts
│   │       ├── smartCrop.test.ts
│   │       ├── ollamaClient.test.ts
│   │       └── pipeline.test.ts
│   ├── e2e/
│   │   ├── dashboard.spec.ts
│   │   └── render-flow.spec.ts
│   └── fixtures/
│       ├── sample-images/
│       └── sample-bgm/
│
└── .remotion/                           # 빌드 산출물 (gitignore)
    └── bundle/
```

---

## 6. 데이터 모델 (Prisma Schema)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Project {
  id              String   @id @default(cuid())
  name            String
  productName     String   @default("")       // AI가 TXT에서 추출
  cta             String   @default("")       // AI가 TXT에서 추출
  documentText    String   @default("")       // 업로드된 TXT 원문
  slidesJson      String   @default("[]")    // AI 분석 결과: JSON [{text, imageId, order}]
  templateId      String
  bgmId           String
  status          String   @default("draft")  // draft|analyzing|reviewed|processing|completed|failed
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  images          ProjectImage[]
  jobs            VideoJob[]
  outputs         Output[]
}

model ProjectImage {
  id           String        @id @default(cuid())
  projectId    String
  project      Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)
  role         String        // AI가 자동 배정 또는 사용자가 수정
  originalPath String
  order        Int
  crops        CroppedImage[]
}

model CroppedImage {
  id          String       @id @default(cuid())
  imageId     String
  image       ProjectImage @relation(fields: [imageId], references: [id], onDelete: Cascade)
  aspectRatio String       // 9:16, 1:1, 16:9
  path        String
  width       Int
  height      Int
  cropX       Int
  cropY       Int
}

model VideoJob {
  id           String    @id @default(cuid())
  projectId    String
  project      Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  type         String    // crop_images, render_916, render_1x1, render_169, thumbnail, script
  status       String    @default("pending")  // pending|running|completed|failed
  progress     Int       @default(0)
  outputPath   String?
  errorMessage String?
  startedAt    DateTime?
  completedAt  DateTime?
  createdAt    DateTime  @default(now())
}

model Template {
  id              String @id @default(cuid())
  name            String
  mood            String   // 감성, 모던, 강렬, 미니멀
  previewImagePath String
  colorPalette    String   // JSON: {primary, secondary, accent, text, background}
  fontFamily      String
  textAnimation   String   // fade_serif, slide_modern, scale_bold, simple_minimal
  transitionStyle String   // fade, slide_left, slide_up, zoom, cut
}

model Bgm {
  id              String @id @default(cuid())
  name            String
  filePath        String
  durationSeconds Float
  bpm             Float
  beats           String  // JSON: BeatMarker[]
  mood            String
}

model Output {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  type      String   // video_916, video_1x1, video_169, thumbnail, script
  filePath  String
  sizeBytes Int
  format    String
  createdAt DateTime @default(now())
}
```

---

## 7. 구현 Phase

### Phase 0: 프로젝트 부트스트랩
- 디렉토리 생성, package.json, tsconfig, tailwind, eslint, prettier
- Dockerfile, docker-compose.yml, .github/workflows/ci.yml
- .env.example, .gitignore
- docs/ 문서 구조 생성 (CLAUDE.md, docs/ref/, docs/status/)
- **AC:** `npm install && npm run dev && npm run lint && tsc --noEmit` 성공

### Phase 1: 타입 & 데이터 레이어
- src/types/*.ts 모든 인터페이스
- prisma/schema.prisma + `prisma generate` + `prisma db push`
- src/lib/db.ts Prisma 클라이언트
- 시드 데이터: 4개 기본 템플릿, 2-3개 기본 BGM
- **AC:** Prisma CRUD 동작, 타입 컴파일 성공

### Phase 2: 웹 대시보드
- 디자인 시스템 컴포넌트 (더스티로즈/베이지 톤)
- MainLayout + Sidebar + Header
- 대시보드 홈 (프로젝트 목록, 활성 작업)
- **프로젝트 생성 3단계 폼:**
  - Step 1: 기획 텍스트 (TXT 업로드 또는 직접 복붙) + 이미지 다수 드래그앤드롭 + 템플릿/BGM 선택 (내장 또는 파일 업로드)
  - Step 2: "AI 분석" 버튼 → Ollama가 TXT 분석 → 슬라이드 자동 조합 결과 표시
  - Step 3: **SlideEditor** — AI 조합 결과 확인/수정 (텍스트 편집, 이미지 순서 변경, 슬라이드 추가/삭제)
- **VideoPreview** — Remotion Player 실시간 미리보기 (Step 3에서 수정 즉시 반영)
- SSE 실시간 진행률 (렌더링 중)
- **AC:** TXT+이미지 업로드 → AI 분석 → 슬라이드 편집 → 미리보기 재생 동작

### Phase 3: 이미지 처리
- smartCrop.ts + objectDetect.ts + imageOptimize.ts
- N이미지 × 3비율 병렬 처리 (이미지 수 유동적)
- **AC:** 10초 이내, 피사체 중심 유지

### Phase 4: Remotion 영상 렌더링
- scripts/bundle-remotion.ts (사전 번들링)
- remotion/Root.tsx (3 Composition 등록)
- TakdiVideo.tsx (메인 컴포지션 — 유동적 슬라이드 수)
- shared/ (TextOverlay, ImageSlide, SubtitleBar, BrandWatermark, CtaOverlay)
- subtitleTiming.ts + beatSnapEngine.ts
- renderWorker.ts (renderMedia 호출)
- **AC:** 각 비율 유효한 MP4, 비트 동기화, 렌더당 40초 이내

### Phase 5: LLM (문서 분석 + 스크립트 생성)
- **documentAnalyzer.ts** — TXT 파일 → Ollama 분석 → 구조화된 슬라이드 데이터 출력
  - 프롬프트: "이 기획 문서를 읽고 제품명/타깃/USP/CTA를 추출하고, N장의 이미지에 맞는 슬라이드를 구성해줘"
  - 출력: `{ productName, slides: [{ text, suggestedImageRole }], cta }`
- ollamaClient.ts + promptTemplates.ts + scriptParser.ts
- 마케팅 스크립트 생성 (기존과 동일)
- 헬스체크 + 대시보드 상태 표시
- **AC:** TXT → 유효한 슬라이드 분류, 마케팅 스크립트 생성, 각 15초 이내

### Phase 6: 산출물 통합
- pipeline.ts 오케스트레이터
- thumbnailGenerator.ts (sharp 합성)
- deliveryManager.ts (NAS 복사)
- manifestWriter.ts
- API routes 연결
- **AC:** 5개 산출물 + manifest, NAS 폴더 정상 생성

### Phase 7: 테스트
- Jest unit tests (subtitleTiming, beatSnap, smartCrop, ollamaClient, pipeline)
- Playwright e2e (대시보드, 렌더 플로우)
- benchmark 스크립트 (120초 이내)
- **AC:** 모든 테스트 통과, 커버리지 70%+

### Phase 8: 배포
- Docker 멀티스테이지 (node:20-bookworm + ffmpeg + chromium + fonts-noto-cjk)
- docker-compose (app + ollama, shm_size: 2gb)
- deploy-mac.sh
- NAS 마운트 설정
- **AC:** docker compose up → 전체 파이프라인 e2e 동작

---

## 8. 구현 순서 & 의존성

```
Phase 0 (부트스트랩) → Phase 1 (타입/DB)
  ↓
  ├→ Phase 2 (대시보드 + 3단계 폼 + Player)    ─┐
  ├→ Phase 3 (이미지 파이프라인)               ─┤
  ├→ Phase 4 (Remotion 영상 렌더링)            ─┼→ Phase 6 (통합)
  └→ Phase 5 (TXT분석 + LLM 스크립트)         ─┘      ↓
                                                  Phase 7 (테스트)
                                                        ↓
                                                  Phase 8 (배포)
```

---

## 9. 성능 예산

### 사전 단계 (사용자 확인 전)
| 단계 | 목표 시간 | 비고 |
|------|-----------|------|
| TXT 파일 읽기 | ~0초 | 단순 파일 읽기 |
| Ollama TXT 분석/분류 | ~10초 | 슬라이드 자동 조합 |
| **사전 분석 총합** | **~10초** | "AI 분석" 버튼 클릭 후 |

### 생성 단계 ("전체 생성" 클릭 후)
| 단계 | 목표 시간 | 비고 |
|------|-----------|------|
| 이미지 크롭 (N장×3비율) | ~5초 | 병렬 처리 |
| Remotion 번들 (캐시) | ~0초 | 사전 빌드 |
| 3영상 렌더 (병렬 2) | ~60초 | 가장 오래 걸림 |
| 썸네일 생성 (영상과 병렬) | ~2초 | - |
| LLM 마케팅 스크립트 (영상과 병렬) | ~10초 | - |
| NAS 복사 | ~3초 | - |
| **생성 총합** | **~75초** ✅ | 2분 목표 내 |

---

## 10. 리스크 & 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Remotion 렌더 느림 | 2분 초과 | 번들 캐시, fps→24, concurrency 조절 |
| @remotion/bundler API route 제약 | 빌드 실패 | 사전 번들링 스크립트로 분리 |
| tf.js 모델 로딩 느림 | 첫 크롭 지연 | 앱 시작 시 워밍업, 모델 캐시 |
| Ollama 미설치/다운 | 스크립트 생성 실패 | 헬스체크 UI + graceful fallback |
| NAS 연결 끊김 | 파일 손실 | 로컬 temp 우선, 완료 후 NAS 복사 |
| Docker 한국어 폰트 깨짐 | 영상 텍스트 오류 | fonts-noto-cjk 명시 설치 |
| Windows↔Mac 경로 차이 | 파일 못 찾음 | path.join() + env로 경로 추상화 |
| Remotion Player SSR 에러 | 페이지 크래시 | 'use client' + dynamic import |

---

## 11. 검증 체크리스트

- [ ] `npm run build` — 타입 에러 0
- [ ] `npm run lint` — 린트 통과
- [ ] `npm run test:unit` — 유닛 테스트 통과
- [ ] `npm run test:e2e` — E2E 테스트 통과
- [ ] Remotion Player에서 3비율 미리보기 정상 재생
- [ ] 샘플 데이터로 "전체 생성" → 5개 산출물 정상 출력
- [ ] 영상 전환이 BGM 비트에 동기화됨
- [ ] 각 템플릿별 텍스트 애니메이션 스타일 구분됨
- [ ] NAS 폴더에 `{프로젝트명}_{YYYYMMDD}/` 정상 생성
- [ ] `docker compose up` → 전체 e2e 동작
- [ ] 전체 파이프라인 120초 이내 완료
