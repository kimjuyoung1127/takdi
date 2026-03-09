# Provider 설정 가이드

Last Updated: 2026-03-09

---

## Provider란?

Provider는 **이미지를 어디서 만들지 선택**하는 설정입니다.

Takdi는 두 가지 방법으로 이미지를 생성할 수 있습니다:

| Provider | 설명 | 특징 |
|----------|------|------|
| `comfyui` | Mac Mini에서 직접 생성 | 인터넷 불필요, 무료, 초기 모델 다운로드 필요 |
| `kie` | 외부 KIE 서버에서 생성 | 인터넷 필요, API 키 필요, 모델 다운로드 불필요 |

---

## .env 파일 위치와 편집 방법

### .env 파일이란?

`.env` 파일은 Takdi의 **설정 파일**입니다. API 키, Provider 설정 등 중요한 설정값이 저장되어 있습니다.

### 파일 위치

```
~/takdi/.env
```

전체 경로: `/Users/[사용자이름]/takdi/.env`

### 편집 방법

#### 방법 1: TextEdit로 편집 (권장)

```bash
open -a TextEdit ~/takdi/.env
```

수정 후 `Cmd + S`로 저장합니다.

#### 방법 2: 터미널에서 nano로 편집

```bash
nano ~/takdi/.env
```

- 화살표 키로 이동
- 텍스트를 직접 수정
- `Ctrl + O` → `Enter`로 저장
- `Ctrl + X`로 종료

#### 방법 3: VS Code로 편집 (설치된 경우)

```bash
code ~/takdi/.env
```

---

## IMAGE_PROVIDER 설정

### ComfyUI 사용 (기본값, 권장)

`.env` 파일에서:

```env
IMAGE_PROVIDER=comfyui
```

ComfyUI를 사용하면:
- Mac Mini에서 직접 이미지를 생성합니다
- 인터넷 연결이 필요 없습니다 (모델 다운로드 후)
- 추가 비용이 없습니다
- 모델 다운로드가 완료되어 있어야 합니다 (`bash scripts/download-models.sh`)

### KIE 사용

`.env` 파일에서:

```env
IMAGE_PROVIDER=kie
```

KIE를 사용하면:
- 외부 서버에서 이미지를 생성합니다
- 안정적인 인터넷 연결이 필요합니다
- API 키가 필요합니다

---

## 각 Provider별 필요한 환경변수

### ComfyUI Provider

```env
# .env 파일 내용

IMAGE_PROVIDER=comfyui

# ComfyUI 연결 설정 (기본값, 변경 불필요)
COMFYUI_URL=http://comfyui:8188
```

> **참고**: `COMFYUI_URL`은 Docker 내부 네트워크 주소입니다. 기본값을 사용하면 되므로 변경하지 않아도 됩니다.

### KIE Provider

```env
# .env 파일 내용

IMAGE_PROVIDER=kie

# KIE API 설정 (필수)
KIE_API_KEY=여기에_KIE_API_키를_붙여넣기
KIE_API_URL=https://api.kie.ai
```

> **참고**: `KIE_API_KEY`는 관리자에게 문의하여 발급받습니다.

### 공통 필수 환경변수

Provider와 상관없이 항상 필요한 환경변수:

```env
# [필수] Gemini API 키 (텍스트 생성용)
GEMINI_API_KEY=여기에_Gemini_API_키를_붙여넣기
```

---

## Provider 전환 방법

Provider를 변경하려면 `.env` 파일을 수정한 후 Docker를 재시작해야 합니다.

### 전체 절차

**1단계: .env 파일 수정**

```bash
open -a TextEdit ~/takdi/.env
```

`IMAGE_PROVIDER=` 값을 변경합니다. 예: `comfyui` → `kie`

**2단계: Docker 재시작** (필수!)

```bash
cd ~/takdi

# 컨테이너 중지
docker compose down

# 컨테이너 다시 시작
docker compose up -d
```

> **중요**: `.env` 파일을 수정한 후에는 반드시 `docker compose down` → `docker compose up -d`를 실행해야 합니다. 단순히 restart만 하면 변경사항이 적용되지 않습니다.

**3단계: 적용 확인**

```bash
cd ~/takdi

# 앱 로그에서 Provider 확인
docker compose logs app | grep -i provider
```

또는 http://localhost:3000 에 접속하여 이미지 생성을 테스트합니다.

---

## 동작 확인 방법

### ComfyUI Provider 확인

```bash
cd ~/takdi

# 1. ComfyUI 컨테이너가 실행 중인지 확인
docker compose ps comfyui

# 2. ComfyUI 웹 UI 접속 확인
curl -s http://localhost:8188 > /dev/null && echo "ComfyUI 정상" || echo "ComfyUI 연결 실패"

# 3. 테스트 이미지 생성
# http://localhost:3000 에서 프로젝트를 만들고 이미지 생성을 시도합니다
```

### KIE Provider 확인

```bash
cd ~/takdi

# 1. KIE API 연결 확인
docker compose logs app | grep -i "kie"

# 2. 테스트 이미지 생성
# http://localhost:3000 에서 프로젝트를 만들고 이미지 생성을 시도합니다
```

### 브라우저에서 테스트 이미지 생성

1. http://localhost:3000 접속
2. 새 프로젝트 생성
3. 이미지 생성 기능 사용
4. 이미지가 정상적으로 생성되면 Provider 설정 완료

---

## 에러 대처법

### API 키 오류

#### 증상
- 이미지 생성 시 "Unauthorized" 또는 "Invalid API key" 에러

#### 해결

```bash
# .env 파일에서 API 키 확인
grep API_KEY ~/takdi/.env
```

- API 키 앞뒤에 공백이나 따옴표가 없는지 확인합니다
- 올바른 형식:
  ```env
  GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
  ```
- 잘못된 형식:
  ```env
  GEMINI_API_KEY="AIzaSyxxxxxxxxxxxxxxxxx"    # 따옴표 불필요
  GEMINI_API_KEY= AIzaSyxxxxxxxxxxxxxxxxx     # 앞에 공백
  ```

키를 수정한 후 Docker 재시작:

```bash
cd ~/takdi
docker compose down
docker compose up -d
```

### ComfyUI 연결 실패

#### 증상
- 이미지 생성 시 "Connection refused" 또는 "ComfyUI not available" 에러

#### 해결

```bash
cd ~/takdi

# ComfyUI 상태 확인
docker compose ps comfyui

# ComfyUI가 중지되어 있으면 시작
docker compose up -d comfyui

# 2-3분 대기 (모델 로딩)

# 연결 확인
curl -s http://localhost:8188 > /dev/null && echo "정상" || echo "아직 로딩 중..."
```

### KIE 연결 실패

#### 증상
- "Network error" 또는 "Timeout" 에러

#### 해결

1. 인터넷 연결 확인:
   ```bash
   ping -c 3 google.com
   ```

2. KIE API 키 확인:
   ```bash
   grep KIE_API ~/takdi/.env
   ```

3. KIE API URL 확인:
   ```bash
   grep KIE_API_URL ~/takdi/.env
   ```

4. API 키와 URL이 올바르면 KIE 서비스 상태를 관리자에게 문의합니다.

### Provider 설정이 적용되지 않을 때

```bash
cd ~/takdi

# 반드시 down → up으로 재시작 (restart가 아님)
docker compose down
docker compose up -d

# 환경변수가 올바르게 적용되었는지 확인
docker compose exec app env | grep IMAGE_PROVIDER
```

출력에 설정한 Provider 값이 보이면 적용된 것입니다.
