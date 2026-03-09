# ComfyUI 설치 및 모델 가이드

Last Updated: 2026-03-09

---

## ComfyUI란?

ComfyUI는 **AI 이미지 생성 엔진**입니다. 텍스트 설명을 입력하면 이미지를 만들어주고, 기존 이미지의 배경을 제거하거나, 이미지를 합성하는 등의 작업을 수행합니다.

Takdi에서는 ComfyUI를 사용하여 쇼츠 영상에 들어갈 이미지를 자동으로 생성합니다.

---

## 설치 방법

### ComfyUI는 별도 설치가 필요 없습니다

ComfyUI는 **Docker 컨테이너**로 자동 설치됩니다. `MAC-MINI-SETUP.md`의 8단계(셋업 스크립트 실행)를 완료했다면 이미 설치되어 있습니다.

설치 확인:

```bash
cd ~/takdi

# ComfyUI 컨테이너 상태 확인
docker compose ps comfyui
```

Status가 `Up` 또는 `running`이면 정상 동작 중입니다.

---

## 모델 설명

ComfyUI는 "모델"이라는 AI 파일을 사용하여 이미지를 생성합니다. 각 모델은 서로 다른 용도와 특성을 가지고 있습니다.

### FLUX.1 Dev

| 항목 | 내용 |
|------|------|
| **용도** | 고품질 이미지 생성 |
| **특징** | 디테일이 풍부하고 정교한 이미지 생성 |
| **속도** | 이미지 1장당 약 15-30초 (M4 기준) |
| **파일 크기** | 약 12GB |
| **사용 시나리오** | 최종 결과물에 사용할 고품질 이미지가 필요할 때 |

### FLUX.1 Schnell

| 항목 | 내용 |
|------|------|
| **용도** | 빠른 이미지 생성 |
| **특징** | Dev보다 빠르지만 품질은 약간 낮음 |
| **속도** | 이미지 1장당 약 5-10초 (M4 기준) |
| **파일 크기** | 약 12GB |
| **사용 시나리오** | 미리보기, 테스트, 대량 이미지 생성 |

### BRIA RMBG (Remove Background)

| 항목 | 내용 |
|------|------|
| **용도** | 이미지 배경 제거 |
| **특징** | 이미지에서 배경을 자동으로 제거하여 투명 배경 생성 |
| **속도** | 이미지 1장당 약 1-3초 |
| **파일 크기** | 약 200MB |
| **사용 시나리오** | 인물/상품 이미지에서 배경을 제거할 때 |

---

## 모델 추가 방법

기본 모델 외에 추가 모델을 설치하고 싶은 경우:

### 1. 모델 파일 다운로드

모델 파일(.safetensors 또는 .ckpt)을 다운로드합니다. 일반적으로 [HuggingFace](https://huggingface.co) 또는 [CivitAI](https://civitai.com)에서 다운로드합니다.

### 2. Docker Volume에 모델 복사

```bash
# 체크포인트 모델 추가 (이미지 생성 모델)
docker cp 다운로드한_모델파일.safetensors $(docker compose ps -q comfyui):/comfyui/models/checkpoints/

# LoRA 모델 추가 (스타일 모델)
docker cp 다운로드한_lora파일.safetensors $(docker compose ps -q comfyui):/comfyui/models/loras/

# VAE 모델 추가
docker cp 다운로드한_vae파일.safetensors $(docker compose ps -q comfyui):/comfyui/models/vae/
```

> **참고**: `다운로드한_모델파일.safetensors` 부분을 실제 파일 이름으로 변경합니다.

### 3. ComfyUI 재시작

모델을 추가한 후 ComfyUI를 재시작해야 인식됩니다:

```bash
cd ~/takdi

docker compose restart comfyui
```

재시작 후 2-3분 기다립니다 (모델 로딩 시간).

---

## ComfyUI 웹 UI 접속

ComfyUI는 자체 웹 인터페이스를 제공합니다. 평소에는 직접 접속할 필요가 없지만, 디버깅이나 워크플로우 확인 시 유용합니다.

### 접속 방법

웹 브라우저에서:

```
http://localhost:8188
```

### 웹 UI에서 할 수 있는 것

- 현재 로드된 모델 확인
- 워크플로우(이미지 생성 과정) 직접 실행
- 이미지 생성 테스트
- 에러 로그 확인

---

## 워크플로우 설명

Takdi에서 사용하는 ComfyUI 워크플로우(이미지 생성 과정)는 다음과 같습니다:

### text-to-image (텍스트 → 이미지)

텍스트 설명(프롬프트)을 입력하면 이미지를 생성합니다.

- **사용 모델**: FLUX.1 Dev 또는 FLUX.1 Schnell
- **용도**: 새로운 이미지 생성 (배경, 일러스트 등)
- **예시**: "한국의 봄 벚꽃이 만개한 공원" → 공원 이미지 생성

### remove-background (배경 제거)

기존 이미지에서 배경을 제거하여 투명 배경 이미지를 만듭니다.

- **사용 모델**: BRIA RMBG
- **용도**: 인물/상품 이미지에서 배경 제거
- **예시**: 인물 사진 → 배경이 투명한 인물 이미지

### img2img-compose (이미지 합성)

기존 이미지를 참고하여 새로운 이미지를 생성하거나 변형합니다.

- **사용 모델**: FLUX.1 Dev 또는 FLUX.1 Schnell
- **용도**: 기존 이미지 스타일 변경, 요소 추가/변경
- **예시**: 낮 풍경 이미지 → 야경 풍경으로 변환

---

## 문제 해결

### ComfyUI가 응답하지 않을 때

#### 증상
- http://localhost:8188 에 접속되지 않음
- Takdi에서 이미지 생성이 실패함

#### 해결 순서

**1. 컨테이너 상태 확인**

```bash
cd ~/takdi
docker compose ps comfyui
```

**2. 상태별 대응**

**상태가 "Exited"인 경우** — 컨테이너가 중지됨:

```bash
# 로그 확인
docker compose logs --tail=50 comfyui

# 컨테이너 재시작
docker compose up -d comfyui
```

**상태가 "Up"인데 접속이 안 되는 경우** — 모델 로딩 중:

```bash
# 실시간 로그 확인 (Ctrl+C로 종료)
docker compose logs -f comfyui
```

로그에 "Loading model" 또는 유사한 메시지가 나오면 모델 로딩 중입니다. 2-3분 기다립니다.

**상태가 "Restarting"인 경우** — 반복 재시작 중:

```bash
# 로그에서 에러 확인
docker compose logs --tail=100 comfyui

# 전체 재시작
docker compose down
docker compose up -d
```

**3. 모델 파일 확인**

모델 파일이 손상되었을 수 있습니다:

```bash
# 모델 다운로드 스크립트 다시 실행
cd ~/takdi
bash scripts/download-models.sh
```

**4. Docker 리소스 확인**

Docker Desktop → Settings → Resources에서:
- Memory: **16GB 이상** 설정
- Disk image size: **100GB 이상** 여유 확인

### 이미지 생성이 실패하는 경우

```bash
cd ~/takdi

# ComfyUI 로그 확인
docker compose logs --tail=100 comfyui

# 앱 로그 확인 (ComfyUI 연결 관련)
docker compose logs --tail=100 app
```

흔한 원인:
- **"Model not found"**: 모델 파일이 없습니다. `bash scripts/download-models.sh`를 실행합니다.
- **"Out of memory"**: Docker에 할당된 메모리가 부족합니다. Docker Desktop 설정에서 메모리를 늘립니다.
- **"Connection refused"**: ComfyUI 컨테이너가 실행 중이 아닙니다. `docker compose up -d comfyui`를 실행합니다.

### ComfyUI 완전 초기화

위 방법으로도 해결되지 않을 때 최후의 수단:

```bash
cd ~/takdi

# ComfyUI 컨테이너 및 볼륨 삭제 (모델은 유지)
docker compose down comfyui
docker compose up -d comfyui

# 그래도 안 되면 모델 포함 전체 재설치
docker compose down -v
bash scripts/setup-mac.sh
bash scripts/download-models.sh
```

> **주의**: `-v` 옵션은 Docker 볼륨(데이터)을 삭제합니다. 모델을 다시 다운로드해야 합니다 (30-60분 소요).
