# Mac Mini M4 초기 설정 가이드

Last Updated: 2026-03-09

## 개요

Mac Mini M4 (256GB RAM, 2TB SSD)에서 Takdi를 자체 운영하기 위한 초기 설정 가이드입니다.
모든 명령어는 **터미널**(Terminal.app)에서 실행합니다. 터미널은 `Cmd + Space` → "터미널" 검색으로 열 수 있습니다.

---

## 1단계: macOS 초기 설정

### 목적
자동 업데이트로 인한 예기치 않은 재시작을 방지합니다.

### 실행 위치
시스템 설정 (화면 왼쪽 상단 Apple 로고 → 시스템 설정)

### 절차

1. **시스템 설정** 열기: 화면 왼쪽 상단 Apple 로고 () 클릭 → **시스템 설정** 클릭
2. 왼쪽 메뉴에서 **일반** 클릭
3. **소프트웨어 업데이트** 클릭
4. 오른쪽 하단 **자동 업데이트** 옆 (i) 아이콘 클릭
5. 다음 항목을 모두 **끄기**:
   - 사용 가능한 경우 새로운 업데이트 다운로드
   - macOS 업데이트 설치
   - App Store에서 앱 업데이트 설치
   - 보안 대응 및 시스템 파일 설치
6. **완료** 클릭

### 추가 설정: 절전 모드 비활성화

서버로 사용하므로 잠자기를 비활성화합니다.

1. **시스템 설정** → **에너지 절약** (또는 **배터리**) 클릭
2. **디스플레이 끄기** 슬라이더를 **안 함**으로 설정
3. **컴퓨터가 자동으로 잠자지 않도록 방지** 체크

또는 터미널에서 실행:

```bash
# 절전 모드 비활성화 (터미널에서 실행)
sudo pmset -a sleep 0
sudo pmset -a disksleep 0
sudo pmset -a displaysleep 0
```

비밀번호를 물으면 Mac 로그인 비밀번호를 입력합니다 (입력 중 화면에 표시되지 않는 것이 정상).

### 이 단계에서 에러가 나면?

- **시스템 설정이 열리지 않음**: Mac을 재시작한 후 다시 시도합니다.
- **sudo 명령에서 "not in the sudoers file"**: 관리자 계정으로 로그인했는지 확인합니다. Mac 초기 설정 시 만든 계정이 관리자입니다.

---

## 2단계: Docker Desktop 설치

### 목적
Takdi는 Docker 컨테이너로 실행됩니다. Docker Desktop이 필수입니다.

### 실행 위치
웹 브라우저 + Finder

### 절차

1. Safari 또는 Chrome에서 다음 주소로 이동:
   ```
   https://www.docker.com/products/docker-desktop/
   ```
2. **Download for Mac - Apple Silicon** 버튼 클릭 (M4는 Apple Silicon입니다)
3. 다운로드된 `Docker.dmg` 파일을 Finder에서 더블클릭
4. Docker 아이콘을 **Applications** 폴더로 드래그
5. **Finder** → **응용 프로그램** → **Docker** 더블클릭하여 실행
6. "Docker Desktop needs privileged access" 메시지가 나오면 **OK** 클릭 → 비밀번호 입력
7. Docker Desktop 화면이 나타나면 설정 진행:
   - 상단 메뉴바의 Docker 아이콘(고래) 클릭 → **Settings** (톱니바퀴)
   - **General** 탭에서 **Start Docker Desktop when you sign in to your computer** 체크 확인
   - **Resources** → **Memory limit**: **16 GB** 이상 설정 권장
   - **Apply & Restart** 클릭

### Docker 설치 확인

터미널을 열고 다음 명령어를 실행합니다:

```bash
docker --version
```

출력 예시:
```
Docker version 27.x.x, build xxxxxxx
```

```bash
docker compose version
```

출력 예시:
```
Docker Compose version v2.x.x
```

### 이 단계에서 에러가 나면?

- **"docker: command not found"**: Docker Desktop이 완전히 시작되지 않았습니다. 상단 메뉴바에 고래 아이콘이 보이는지 확인합니다. 아이콘이 움직이고 있으면 아직 시작 중입니다. 멈출 때까지 기다립니다.
- **다운로드가 느림**: 인터넷 연결을 확인합니다. Docker Desktop은 약 700MB입니다.
- **"Apple Silicon" 선택이 없음**: 페이지에서 "Mac with Apple chip"을 선택합니다.

---

## 3단계: NAS 마운트 설정

### 목적
백업 및 대용량 파일 저장을 위해 NAS를 연결합니다.

### 실행 위치
Finder

### 절차

1. **Finder** 열기 (Dock에서 웃는 얼굴 아이콘 클릭)
2. 메뉴바에서 **이동** → **서버에 연결** (또는 `Cmd + K`)
3. 서버 주소 입력:
   ```
   smb://NAS주소/takdi
   ```
   - `NAS주소` 부분을 실제 NAS의 IP 주소로 변경합니다 (예: `smb://192.168.1.100/takdi`)
4. **연결** 클릭
5. NAS 사용자 이름과 비밀번호 입력
6. **내 키체인에 이 비밀번호 기억** 체크
7. **연결** 클릭

연결되면 Finder 왼쪽 사이드바에 NAS 이름이 나타납니다.

### 마운트 확인

터미널에서 실행:

```bash
ls /Volumes/takdi
```

NAS의 파일 목록이 보이면 성공입니다.

### 이 단계에서 에러가 나면?

- **"서버에 연결할 수 없음"**: NAS가 켜져 있는지, Mac과 같은 네트워크에 있는지 확인합니다.
- **NAS IP 주소를 모를 때**: NAS 관리 페이지 또는 공유기 관리 페이지에서 확인합니다.
- **"takdi 공유 폴더가 없음"**: NAS에서 `takdi`라는 공유 폴더를 먼저 만들어야 합니다.

---

## 4단계: NAS 자동 마운트 설정

### 목적
Mac을 재시작해도 NAS가 자동으로 연결되도록 합니다.

### 실행 위치
시스템 설정

### 절차

1. **시스템 설정** → **일반** → **로그인 항목 및 확장 프로그램**
2. **로그인 시 열기** 섹션에서 **+** 버튼 클릭
3. 왼쪽 사이드바에서 **네트워크** 또는 NAS 이름 선택
4. NAS의 `takdi` 폴더를 선택하고 **열기** 클릭

또는 터미널에서 자동 마운트 스크립트를 설정할 수 있습니다:

```bash
# 자동 마운트 설정 (터미널에서 실행)
# NAS주소, 사용자명, 비밀번호를 실제 값으로 변경하세요

cat <<'SCRIPT' > ~/Library/LaunchAgents/com.takdi.nas-mount.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.takdi.nas-mount</string>
    <key>ProgramArguments</key>
    <array>
        <string>/sbin/mount_smbfs</string>
        <string>//사용자명:비밀번호@NAS주소/takdi</string>
        <string>/Volumes/takdi</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
SCRIPT

echo "자동 마운트 설정 완료"
```

> **참고**: 위 스크립트에서 `사용자명`, `비밀번호`, `NAS주소`를 실제 값으로 변경해야 합니다.

### 이 단계에서 에러가 나면?

- **로그인 항목에서 NAS가 보이지 않음**: 3단계에서 NAS를 먼저 수동으로 마운트한 후 다시 시도합니다.
- **재시작 후 자동 마운트가 안 됨**: NAS가 Mac보다 늦게 켜지는 경우 발생합니다. NAS가 먼저 켜진 후 Mac을 시작합니다.

---

## 5단계: Git 설치

### 목적
프로젝트 코드를 다운로드하고 업데이트하기 위해 Git이 필요합니다.

### 실행 위치
터미널 (아무 경로에서나)

### 절차

터미널을 열고 다음 명령어를 실행합니다:

```bash
xcode-select --install
```

팝업 창이 나타나면 **설치** 버튼을 클릭합니다. 약 5-10분 소요됩니다.

### 설치 확인

```bash
git --version
```

출력 예시:
```
git version 2.x.x (Apple Git-xxx)
```

### 이 단계에서 에러가 나면?

- **"xcode-select: error: command line tools are already installed"**: 이미 설치되어 있습니다. 다음 단계로 진행하면 됩니다.
- **팝업이 나타나지 않음**: Mac App Store에서 Xcode를 검색하여 설치합니다 (용량이 크므로 Command Line Tools만 설치하는 것이 좋습니다).
- **설치가 중간에 멈춤**: 인터넷 연결을 확인하고, `xcode-select --install`을 다시 실행합니다.

---

## 6단계: 프로젝트 클론

### 목적
Takdi 프로젝트 코드를 Mac에 다운로드합니다.

### 실행 위치
터미널 (홈 디렉토리)

### 절차

```bash
# 홈 디렉토리로 이동
cd ~

# 프로젝트 클론 (주소는 실제 저장소 URL로 변경)
git clone [repo-url] ~/takdi

# 프로젝트 폴더로 이동
cd ~/takdi
```

> **참고**: `[repo-url]`을 전달받은 실제 Git 저장소 주소로 변경해야 합니다.

### 클론 확인

```bash
cd ~/takdi && ls
```

`docker-compose.yml`, `package.json`, `scripts/` 등의 파일과 폴더가 보이면 성공입니다.

### 이 단계에서 에러가 나면?

- **"Permission denied"**: Git 저장소 접근 권한이 있는지 확인합니다. SSH 키 또는 토큰 설정이 필요할 수 있습니다.
- **"fatal: destination path already exists"**: 이미 `~/takdi` 폴더가 있습니다. 기존 폴더를 삭제하려면:
  ```bash
  rm -rf ~/takdi
  ```
  그 후 다시 `git clone` 명령어를 실행합니다.
- **다운로드가 느림**: 저장소 크기에 따라 몇 분이 걸릴 수 있습니다.

---

## 7단계: 환경 설정 (.env 파일)

### 목적
Takdi 실행에 필요한 API 키와 설정 값을 입력합니다.

### 실행 위치
터미널 (`~/takdi` 디렉토리)

### 절차

```bash
# 프로젝트 폴더로 이동
cd ~/takdi

# 환경 파일 템플릿 복사
cp .env.example .env

# 텍스트 편집기로 .env 파일 열기
open -a TextEdit .env
```

TextEdit에서 열린 `.env` 파일에서 다음 항목을 수정합니다:

```env
# [필수] Gemini API 키
GEMINI_API_KEY=여기에_API_키를_붙여넣기

# [선택] 이미지 생성 Provider (기본값: comfyui)
IMAGE_PROVIDER=comfyui

# [선택] NAS 백업 경로 (NAS를 사용하는 경우)
BACKUP_PATH=/Volumes/takdi/backups
```

수정 후 `Cmd + S`로 저장하고 TextEdit를 닫습니다.

### GEMINI_API_KEY 발급 방법

1. 웹 브라우저에서 https://aistudio.google.com/apikey 접속
2. Google 계정으로 로그인
3. **Create API Key** 클릭
4. 생성된 API 키를 복사하여 `.env` 파일에 붙여넣기

### 설정 확인

```bash
cd ~/takdi

# .env 파일에 GEMINI_API_KEY가 설정되었는지 확인
grep GEMINI_API_KEY .env
```

`GEMINI_API_KEY=ai...` 형태로 키 값이 보이면 성공입니다.

### 이 단계에서 에러가 나면?

- **".env.example 파일이 없음"**: 프로젝트가 올바르게 클론되었는지 확인합니다 (6단계).
- **TextEdit에서 파일이 열리지 않음**: 터미널에서 직접 편집합니다:
  ```bash
  nano ~/takdi/.env
  ```
  편집 후 `Ctrl + O` → Enter → `Ctrl + X`로 저장 및 종료합니다.
- **API 키를 모르겠음**: 관리자에게 문의합니다.

---

## 8단계: 셋업 스크립트 실행

### 목적
Docker 이미지 빌드, 컨테이너 생성 등 자동 설정을 실행합니다.

### 실행 위치
터미널 (`~/takdi` 디렉토리)

### 절차

```bash
# 프로젝트 폴더로 이동
cd ~/takdi

# 셋업 스크립트 실행
bash scripts/setup-mac.sh
```

이 스크립트는 약 **10-20분** 소요됩니다. 진행 상황이 터미널에 표시됩니다.
스크립트가 완료되면 "Setup complete!" 또는 유사한 완료 메시지가 나타납니다.

### 이 단계에서 에러가 나면?

- **"Docker is not running"**: Docker Desktop이 실행 중인지 확인합니다. 상단 메뉴바에 고래 아이콘이 있어야 합니다.
- **"Permission denied"**: 스크립트 실행 권한을 부여합니다:
  ```bash
  chmod +x ~/takdi/scripts/setup-mac.sh
  bash ~/takdi/scripts/setup-mac.sh
  ```
- **"docker compose" 관련 에러**: Docker Desktop을 최신 버전으로 업데이트합니다.
- **네트워크 에러 (timeout, connection refused)**: 인터넷 연결을 확인합니다. Docker 이미지를 다운로드하려면 인터넷이 필요합니다.
- **디스크 공간 부족**: Docker Desktop → Settings → Resources에서 디스크 이미지 크기를 확인합니다.

---

## 9단계: 모델 다운로드

### 목적
AI 이미지 생성에 필요한 모델 파일을 다운로드합니다.

### 실행 위치
터미널 (`~/takdi` 디렉토리)

### 절차

```bash
# 프로젝트 폴더로 이동
cd ~/takdi

# 모델 다운로드 스크립트 실행
bash scripts/download-models.sh
```

이 스크립트는 인터넷 속도에 따라 **30분~60분** 소요될 수 있습니다.
다운로드되는 모델 파일은 총 **약 20-30GB**입니다.

### 다운로드되는 모델 목록

| 모델 | 용도 | 크기 (약) |
|------|------|-----------|
| FLUX.1 Dev | 고품질 이미지 생성 | ~12GB |
| FLUX.1 Schnell | 빠른 이미지 생성 | ~12GB |
| BRIA RMBG | 배경 제거 | ~200MB |

### 이 단계에서 에러가 나면?

- **다운로드가 중간에 끊김**: 스크립트를 다시 실행하면 이어받기가 됩니다:
  ```bash
  cd ~/takdi && bash scripts/download-models.sh
  ```
- **"No space left on device"**: 디스크 공간을 확인합니다:
  ```bash
  df -h /
  ```
  최소 50GB의 여유 공간이 필요합니다.
- **다운로드 속도가 매우 느림**: 유선 인터넷(이더넷) 연결을 권장합니다.

---

## 10단계: 동작 확인

### 목적
Takdi가 정상적으로 실행되고 있는지 확인합니다.

### 실행 위치
터미널 + 웹 브라우저

### 절차

#### 컨테이너 상태 확인

```bash
cd ~/takdi

# 실행 중인 컨테이너 확인
docker compose ps
```

모든 컨테이너의 Status가 `Up` 또는 `running`이면 정상입니다.

#### 웹 브라우저에서 확인

1. Safari 또는 Chrome을 엽니다
2. 주소창에 다음을 입력합니다:
   ```
   http://localhost:3000
   ```
3. Takdi 화면이 나타나면 성공입니다!

#### ComfyUI 확인 (선택사항)

```
http://localhost:8188
```

ComfyUI 웹 인터페이스가 나타나면 이미지 생성 엔진도 정상입니다.

### 이 단계에서 에러가 나면?

- **"이 사이트에 연결할 수 없음"**: 컨테이너가 아직 시작되지 않았을 수 있습니다. 30초 기다린 후 새로고침합니다.
- **컨테이너 상태가 "Exited"**: 로그를 확인합니다:
  ```bash
  cd ~/takdi && docker compose logs app
  ```
- **포트 충돌**: 3000번 포트를 다른 프로그램이 사용 중인지 확인합니다:
  ```bash
  lsof -i :3000
  ```
- **모든 것이 실패할 때**: 전체 재시작을 시도합니다:
  ```bash
  cd ~/takdi
  docker compose down
  docker compose up -d
  ```
  2분 기다린 후 http://localhost:3000 에 다시 접속합니다.

---

## 완료!

모든 단계를 완료했습니다. 이제 Takdi를 사용할 수 있습니다.

일상적인 운영에 대해서는 [RUNBOOK.md](./RUNBOOK.md)를 참고하세요.
문제가 발생하면 [RUNBOOK.md](./RUNBOOK.md)의 FAQ 섹션을 먼저 확인하세요.
