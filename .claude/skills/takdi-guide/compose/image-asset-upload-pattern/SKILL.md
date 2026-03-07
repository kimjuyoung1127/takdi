---
name: image-asset-upload-pattern
description: Unified image/asset upload pattern for the compose editor.
---

## Trigger
- "이미지 업로드", "에셋 업로드", "image upload", "asset upload pattern"

## Read First
1. `src/lib/api-client.ts` — `uploadAsset()` 함수 시그니처
2. `src/components/compose/shared/image-upload-zone.tsx` — ImageUploadZone 컴포넌트
3. `src/components/compose/shared/video-upload-zone.tsx` — VideoUploadZone 컴포넌트
4. `src/components/compose/compose-context.tsx` — `useCompose()` 훅

## Do

### 1. 업로드 API 사용법
```ts
import { uploadAsset } from "@/lib/api-client";
import { useCompose } from "../compose-context";

const { projectId } = useCompose();
const asset = await uploadAsset(projectId, file);
// asset.url — 업로드된 이미지 URL
```

### 2. 파일 검증 규칙
- **이미지**: `accept="image/png,image/jpeg,image/webp,image/gif"`
- **비디오**: `accept="video/mp4,video/webm,image/gif"`
- **최대 크기**: API/서버 설정에 따름 (클라이언트에서 사전 체크 권장)
- 파일 타입 불일치 시 `toast`로 에러 메시지

### 3. UX 패턴 (3단계)

**로딩 상태:**
```tsx
{uploading ? (
  <div className="flex items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
  </div>
) : (
  // 업로드 영역 또는 미리보기
)}
```

**에러 상태:**
- `try/catch`로 업로드 실패 감지
- `toast.error("이미지 업로드에 실패했습니다")` 표시
- 기존 이미지가 있으면 유지, 없으면 빈 상태로 복귀

**성공 상태:**
- `onUpdate({ imageUrl: asset.url })` 로 블록 데이터 갱신
- 미리보기 즉시 반영

### 4. readOnly 모드
- `readOnly` prop이 true이면 업로드 UI 숨김
- 이미지만 표시, 클릭/드롭 이벤트 비활성화
```tsx
{readOnly ? (
  <img src={block.imageUrl} alt="" className="w-full" />
) : (
  <ImageUploadZone ... />
)}
```

### 5. 이벤트 전파 방지
- 업로드 영역 클릭 시 `e.stopPropagation()` 필수 (블록 선택 이벤트와 충돌 방지)

## Shared Components Reference
| 컴포넌트 | 위치 | 용도 |
|---|---|---|
| `ImageUploadZone` | `compose/shared/` | 이미지 클릭/드롭 업로드 + 미리보기 + 교체 오버레이 |
| `VideoUploadZone` | `compose/shared/` | 비디오/GIF 업로드 |
| `image-picker.tsx` | `compose/` | 이미지 선택 팝오버 (파일 업로드 + URL 입력) |

## Validation
- [ ] `uploadAsset()` 사용 시 `useCompose()` 에서 projectId 획득
- [ ] 파일 타입 검증 포함
- [ ] 로딩/에러/성공 3단계 UX 구현
- [ ] readOnly 모드에서 업로드 UI 비활성화
- [ ] `e.stopPropagation()` 적용
