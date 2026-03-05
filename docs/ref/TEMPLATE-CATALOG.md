# 템플릿 카탈로그 (4종)

> **프로젝트:** 탁디장 스튜디오
> **최종 수정:** 2026-03-05
> **템플릿 수:** 4종
> **적용 대상:** Remotion TakdiVideo 컴포지션

---

## 개요

각 템플릿은 `Template` DB 모델에 시드 데이터로 등록되며, `TextOverlay.tsx`의 `animationMap`에서 텍스트 애니메이션을, `ImageSlide.tsx`에서 이미지 전환을 제어한다.

```typescript
type TextAnimation = 'fade_serif' | 'slide_modern' | 'scale_bold' | 'simple_minimal';
```

---

## 1. 감성 템플릿 (fade_serif)

### 무드

부드럽고 따뜻한 감성. 고급스러운 세리프 폰트와 느린 페이드 전환으로 제품의 품격을 강조한다. 화장품, 뷰티, 스킨케어 제품에 최적화된 템플릿.

### 컬러 팔레트

| 역할 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| Primary | 더스티 로즈 | `#C4756E` | 텍스트 강조, CTA 배경 |
| Secondary | 소프트 피치 | `#D4A59A` | 서브 텍스트, 자막 바 배경 |
| Accent | 딥 테라코타 | `#8B4E47` | 포인트 요소, 워터마크 |
| Text | 다크 브라운 | `#2D2420` | 본문 텍스트 |
| Background | 웜 크림 | `#F2E6E0` | 배경색, 오버레이 |

### 폰트

| 용도 | 폰트명 | 굵기 | 비고 |
|------|--------|------|------|
| 제목 | Noto Serif KR | 700 (Bold) | 감성적 세리프체 |
| 본문 | Noto Serif KR | 400 (Regular) | 통일감 유지 |

### 텍스트 애니메이션 (fade_serif)

느린 페이드인과 미세한 스케일업을 조합한 부드러운 등장 효과.

```typescript
fade_serif: (frame, fps) => ({
  opacity: interpolate(
    frame,
    [0, fps * 0.5],           // 0.5초에 걸쳐 페이드인
    [0, 1],
    { extrapolateRight: 'clamp' }
  ),
  transform: `scale(${interpolate(
    frame,
    [0, fps * 0.5],           // 0.5초에 걸쳐 95% → 100% 스케일
    [0.95, 1],
    { extrapolateRight: 'clamp' }
  )})`,
  fontFamily: 'Noto Serif KR',
})
```

**파라미터 상세:**
- `interpolate` 구간: 0프레임 ~ fps*0.5 프레임 (30fps 기준 15프레임 = 0.5초)
- 불투명도: 0 → 1 (완전투명 → 완전불투명)
- 스케일: 0.95 → 1.0 (살짝 작은 상태에서 원래 크기로)
- `extrapolateRight: 'clamp'` — 0.5초 이후 값 고정

### 이미지 전환 스타일

- **Ken Burns:** 느린 줌인 (1.0 → 1.08, 슬라이드 전체 구간)
- **전환 인:** 페이드인 0.3초 (`interpolate` opacity 0→1)
- **전환 아웃:** 페이드아웃 0.3초 (`interpolate` opacity 1→0)
- **전환 타입:** `fade` (부드러운 크로스 디졸브 느낌)

### 적합한 제품 유형

- 화장품 / 뷰티 / 스킨케어
- 향수 / 바디케어
- 프리미엄 패션 소품
- 감성 라이프스타일 브랜드

---

## 2. 모던 템플릿 (slide_modern)

### 무드

깔끔하고 세련된 모던 스타일. 화이트/차콜 기반의 미니멀한 색감에 슬라이드업 모션으로 테크 제품의 신뢰감을 전달한다.

### 컬러 팔레트

| 역할 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| Primary | 차콜 | `#333333` | 제목 텍스트, CTA 배경 |
| Secondary | 미디엄 그레이 | `#666666` | 서브 텍스트, 자막 바 |
| Accent | 일렉트릭 블루 | `#2196F3` | 포인트 강조, 하이라이트 |
| Text | 다크 블랙 | `#1A1A1A` | 본문 텍스트 |
| Background | 퓨어 화이트 | `#FFFFFF` | 배경색 |

### 폰트

| 용도 | 폰트명 | 굵기 | 비고 |
|------|--------|------|------|
| 제목 | Pretendard | 700 (Bold) | 가독성 높은 산세리프 |
| 본문 | Pretendard | 400 (Regular) | 깔끔한 본문 |

### 텍스트 애니메이션 (slide_modern)

아래에서 위로 슬라이드업하며 나타나는 클린한 모션.

```typescript
slide_modern: (frame, fps) => ({
  opacity: interpolate(
    frame,
    [0, fps * 0.3],           // 0.3초에 걸쳐 페이드인
    [0, 1],
    { extrapolateRight: 'clamp' }
  ),
  transform: `translateY(${interpolate(
    frame,
    [0, fps * 0.3],           // 0.3초에 걸쳐 30px 위로 이동
    [30, 0],
    { extrapolateRight: 'clamp' }
  )}px)`,
  fontFamily: 'Pretendard',
})
```

**파라미터 상세:**
- `interpolate` 구간: 0프레임 ~ fps*0.3 프레임 (30fps 기준 9프레임 = 0.3초)
- 불투명도: 0 → 1
- Y 이동: 30px → 0px (아래에서 위로)
- 감성 템플릿보다 빠른 전환 (0.3초 vs 0.5초)

### 이미지 전환 스타일

- **Ken Burns:** 느린 줌인 (1.0 → 1.08)
- **전환 인:** 페이드인 0.3초
- **전환 아웃:** 페이드아웃 0.3초
- **전환 타입:** `slide_left` (선택사항, 이미지가 좌측에서 등장)

### 적합한 제품 유형

- 테크 / 전자제품 / 가전
- SaaS / 앱 서비스
- IT 액세서리
- 비즈니스 / 오피스 용품

---

## 3. 강렬 템플릿 (scale_bold)

### 무드

임팩트 있고 역동적인 스타일. 블랙/레드 기반의 강렬한 색감에 스프링 바운스 모션으로 시선을 확 잡는다. 식품, 스포츠, 에너지 관련 제품에 최적.

### 컬러 팔레트

| 역할 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| Primary | 볼드 레드 | `#E53935` | 제목 강조, CTA 배경 |
| Secondary | 다크 레드 | `#B71C1C` | 서브 텍스트 강조 |
| Accent | 브라이트 옐로 | `#FFD600` | 포인트, 배지, 할인 강조 |
| Text | 퓨어 화이트 | `#FFFFFF` | 본문 텍스트 (어두운 배경 위) |
| Background | 딥 블랙 | `#121212` | 배경색 |

### 폰트

| 용도 | 폰트명 | 굵기 | 비고 |
|------|--------|------|------|
| 제목 | Pretendard | 900 (Black) | 극굵기로 임팩트 |
| 본문 | Pretendard | 700 (Bold) | 가독성 + 힘 있는 느낌 |

### 텍스트 애니메이션 (scale_bold)

Remotion `spring()` 함수를 사용한 물리 기반 바운스 스케일업.

```typescript
scale_bold: (frame, fps) => {
  const s = spring({
    frame,
    fps,
    config: {
      mass: 0.5,         // 가벼운 질량 → 빠른 반응
      damping: 12,       // 중간 감쇠 → 약간의 바운스
      stiffness: 200,    // 높은 강성 → 빠른 도달
    },
  });
  return {
    opacity: 1,          // 즉시 보임 (페이드 없음)
    transform: `scale(${s})`,
    fontFamily: 'Pretendard',
    fontWeight: 900,
    textShadow: '0 4px 20px rgba(0,0,0,0.4)',  // 글자 그림자
  };
}
```

**spring 파라미터 상세:**
- `mass: 0.5` — 가벼운 질량으로 빠른 가속
- `damping: 12` — 중간 감쇠로 1~2회 오버슈트(바운스) 후 정지
- `stiffness: 200` — 높은 강성으로 목표값에 빠르게 수렴
- 스케일: 0 → 1 (spring 기본값), 바운스로 ~1.05까지 오버슈트 후 1.0에 안착
- 별도 `textShadow`로 깊이감 추가

### 이미지 전환 스타일

- **Ken Burns:** 줌인 (1.0 → 1.08, 약간 더 빠른 느낌)
- **전환 인:** 페이드인 0.3초
- **전환 아웃:** 페이드아웃 0.3초
- **전환 타입:** `zoom` (줌인하며 등장)

### 적합한 제품 유형

- 식품 / 음료 / 건강기능식품
- 스포츠 용품 / 운동 장비
- 에너지 드링크 / 보충제
- 세일 / 프로모션 광고

---

## 4. 미니멀 템플릿 (simple_minimal)

### 무드

절제된 아름다움. 라이트 그레이/블랙의 모노톤에 느린 페이드로 제품 자체에 집중하게 만든다. 라이프스타일, 인테리어 등 여백의 미를 살리는 제품에 적합.

### 컬러 팔레트

| 역할 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| Primary | 소프트 블랙 | `#2C2C2C` | 제목 텍스트 |
| Secondary | 미디엄 그레이 | `#999999` | 서브 텍스트, 자막 |
| Accent | 웜 그레이 | `#BDBDBD` | 구분선, 미세 포인트 |
| Text | 다크 그레이 | `#424242` | 본문 텍스트 |
| Background | 라이트 그레이 | `#F5F5F5` | 배경색 |

### 폰트

| 용도 | 폰트명 | 굵기 | 비고 |
|------|--------|------|------|
| 제목 | Pretendard | 300 (Light) | 얇은 굵기로 미니멀함 |
| 본문 | Pretendard | 300 (Light) | 통일된 경량 스타일 |

### 텍스트 애니메이션 (simple_minimal)

가장 느린 페이드인. 텍스트가 서서히 나타나 정적으로 유지된다.

```typescript
simple_minimal: (frame, fps) => ({
  opacity: interpolate(
    frame,
    [0, fps * 0.8],           // 0.8초에 걸쳐 느린 페이드인
    [0, 1],
    { extrapolateRight: 'clamp' }
  ),
  fontFamily: 'Pretendard',
  fontWeight: 300,
})
```

**파라미터 상세:**
- `interpolate` 구간: 0프레임 ~ fps*0.8 프레임 (30fps 기준 24프레임 = 0.8초)
- 불투명도: 0 → 1 (가장 느린 페이드)
- 위치 이동 없음 (transform 미사용)
- 폰트 굵기: 300 (Light) — 가벼운 인상

### 이미지 전환 스타일

- **Ken Burns:** 최소한의 줌인 (1.0 → 1.05, 다른 템플릿보다 미세)
- **전환 인:** 느린 페이드인 0.5초
- **전환 아웃:** 느린 페이드아웃 0.5초
- **전환 타입:** `fade` (크로스 디졸브, 가장 정적인 전환)

### 적합한 제품 유형

- 라이프스타일 / 인테리어
- 문구 / 디자인 소품
- 의류 / 패션 (캐주얼, 베이직)
- 카페 / 음료 (감성 브랜딩)

---

## 템플릿 비교 요약

| 항목 | 감성 (fade_serif) | 모던 (slide_modern) | 강렬 (scale_bold) | 미니멀 (simple_minimal) |
|------|-------------------|--------------------|--------------------|------------------------|
| 폰트 | Noto Serif KR | Pretendard | Pretendard Black | Pretendard Light |
| 배경 | 웜 크림 `#F2E6E0` | 화이트 `#FFFFFF` | 블랙 `#121212` | 라이트그레이 `#F5F5F5` |
| 메인색 | 더스티로즈 `#C4756E` | 차콜 `#333333` | 레드 `#E53935` | 소프트블랙 `#2C2C2C` |
| 애니메이션 | 페이드+스케일 0.5초 | 슬라이드업 0.3초 | 스프링 바운스 | 느린 페이드 0.8초 |
| 에너지 | 낮음 (부드러움) | 중간 (깔끔함) | 높음 (역동적) | 최저 (정적) |
| 적합 제품 | 화장품/뷰티 | 테크/가전 | 식품/스포츠 | 라이프스타일 |

---

## DB 시드 데이터 예시

```typescript
// prisma/seed.ts
const templates = [
  {
    name: '감성',
    mood: '감성',
    colorPalette: JSON.stringify({
      primary: '#C4756E',
      secondary: '#D4A59A',
      accent: '#8B4E47',
      text: '#2D2420',
      background: '#F2E6E0',
    }),
    fontFamily: 'Noto Serif KR',
    textAnimation: 'fade_serif',
    transitionStyle: 'fade',
  },
  {
    name: '모던',
    mood: '모던',
    colorPalette: JSON.stringify({
      primary: '#333333',
      secondary: '#666666',
      accent: '#2196F3',
      text: '#1A1A1A',
      background: '#FFFFFF',
    }),
    fontFamily: 'Pretendard',
    textAnimation: 'slide_modern',
    transitionStyle: 'slide_left',
  },
  {
    name: '강렬',
    mood: '강렬',
    colorPalette: JSON.stringify({
      primary: '#E53935',
      secondary: '#B71C1C',
      accent: '#FFD600',
      text: '#FFFFFF',
      background: '#121212',
    }),
    fontFamily: 'Pretendard',
    textAnimation: 'scale_bold',
    transitionStyle: 'zoom',
  },
  {
    name: '미니멀',
    mood: '미니멀',
    colorPalette: JSON.stringify({
      primary: '#2C2C2C',
      secondary: '#999999',
      accent: '#BDBDBD',
      text: '#424242',
      background: '#F5F5F5',
    }),
    fontFamily: 'Pretendard',
    textAnimation: 'simple_minimal',
    transitionStyle: 'fade',
  },
];
```
