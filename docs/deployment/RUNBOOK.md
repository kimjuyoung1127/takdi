# Takdi 운영 매뉴얼

Last Updated: 2026-03-09

---

## 개요

Takdi의 일상적인 운영, 문제 해결, 업데이트 방법을 담은 매뉴얼입니다.
모든 명령어는 **터미널**(Terminal.app)에서 실행합니다. 터미널은 `Cmd + Space` → "터미널" 검색으로 열 수 있습니다.

---

## 앱 시작하기

### 방법 1: Finder에서 더블클릭 (가장 쉬운 방법)

1. **Finder** 열기
2. `~/takdi/scripts/` 폴더로 이동
3. `start.command` 파일을 **더블클릭**

### 방법 2: 터미널에서 실행

```bash
cd ~/takdi
docker compose up -d
```

### 확인

시작 후 30초~1분 기다린 후 웹 브라우저에서:

```
http://localhost:3000
```

Takdi 화면이 나타나면 정상 시작된 것입니다.

---

## 앱 정지하기

### 방법 1: Finder에서 더블클릭

1. **Finder** 열기
2. `~/takdi/scripts/` 폴더로 이동
3. `stop.command` 파일을 **더블클릭**

### 방법 2: 터미널에서 실행

```bash
cd ~/takdi
docker compose down
```

### 확인

```bash
cd ~/takdi
docker compose ps
```

아무 컨테이너도 표시되지 않으면 정지 완료입니다.

---

## 앱 재시작하기

### 방법 1: Docker Desktop에서 (가장 쉬운 방법)

1. 상단 메뉴바의 **Docker 아이콘**(고래) 클릭
2. **Dashboard** 또는 **Open Docker Desktop** 클릭
3. 왼쪽 메뉴에서 **Containers** 클릭
4. `takdi` 그룹을 찾기
5. 오른쪽의 **Restart** 버튼 (회전 화살표) 클릭

### 방법 2: 터미널에서 실행

```bash
cd ~/takdi
docker compose restart
```

### 방법 3: 완전 재시작 (문제가 있을 때)

```bash
cd ~/takdi
docker compose down
docker compose up -d
```

> **참고**: `restart`와 `down` + `up -d`의 차이
> - `restart`: 컨테이너만 재시작 (빠름, 환경변수 변경 미반영)
> - `down` + `up -d`: 컨테이너를 완전히 삭제 후 재생성 (느리지만 모든 변경사항 반영)

---

## 로그 확인하기

문제가 발생했을 때 로그를 확인하면 원인을 파악할 수 있습니다.

### 앱 로그 확인

```bash
cd ~/takdi

# 최근 로그 50줄 보기
docker compose logs --tail=50 app
```

### ComfyUI 로그 확인

```bash
cd ~/takdi

# 최근 로그 50줄 보기
docker compose logs --tail=50 comfyui
```

### 전체 로그 확인

```bash
cd ~/takdi

# 모든 컨테이너의 최근 로그 보기
docker compose logs --tail=100
```

### 실시간 로그 보기 (문제 추적 시)

```bash
cd ~/takdi

# 실시간 로그 (Ctrl+C로 종료)
docker compose logs -f app
```

---

## 이미지 생성이 느려요

### 원인

ComfyUI는 **첫 실행 시 모델을 메모리에 로딩**합니다. 이 과정에서 2-3분이 소요됩니다.

### 정상적인 경우

- **첫 번째 이미지 생성**: 2-3분 소요 (모델 로딩 포함)
- **두 번째 이미지부터**: 5-30초 소요 (모델이 이미 로딩됨)

### 해결 방법

1. **첫 이미지 생성 시**: 2-3분 기다립니다. 이것은 정상입니다.
2. **계속 느린 경우**: Docker에 할당된 메모리를 확인합니다.
   - Docker Desktop → Settings → Resources → Memory
   - **16GB 이상** 권장
3. **재시작 후 첫 이미지**: Mac 또는 Docker를 재시작하면 모델을 다시 로딩해야 합니다. 첫 이미지가 느린 것은 정상입니다.

### ComfyUI 모델 로딩 상태 확인

```bash
cd ~/takdi

# 실시간 로그에서 모델 로딩 상태 확인
docker compose logs -f comfyui
```

"Loading model" 메시지가 보이면 로딩 중입니다. "Model loaded" 메시지가 나올 때까지 기다립니다.

---

## 이미지 생성이 실패해요

### 확인 순서

**1. ComfyUI 상태 확인**

```bash
cd ~/takdi
docker compose ps comfyui
```

Status가 `Up`이 아니면:

```bash
docker compose up -d comfyui
```

**2. ComfyUI 로그 확인**

```bash
cd ~/takdi
docker compose logs --tail=50 comfyui
```

**3. 모델 파일 확인**

```bash
cd ~/takdi

# 모델 다운로드 다시 실행
bash scripts/download-models.sh
```

**4. 앱과 ComfyUI 연결 확인**

```bash
cd ~/takdi
docker compose logs --tail=50 app | grep -i "comfyui\|image\|error"
```

**5. 전체 재시작**

위 방법으로 해결되지 않으면:

```bash
cd ~/takdi
docker compose down
docker compose up -d
```

2분 후 다시 시도합니다.

---

## 디스크 공간이 부족해요

### 현재 디스크 사용량 확인

```bash
df -h /
```

`Use%`가 90% 이상이면 정리가 필요합니다.

### Docker 시스템 정리

사용하지 않는 Docker 이미지, 컨테이너, 캐시를 삭제합니다:

```bash
docker system prune
```

"Are you sure you want to continue?" 메시지가 나오면 `y`를 입력하고 Enter를 누릅니다.

### 더 많은 공간 확보

```bash
# 사용하지 않는 Docker 이미지까지 모두 삭제
docker system prune -a
```

> **주의**: 이 명령은 현재 실행 중이지 않은 모든 Docker 이미지를 삭제합니다. 다음 시작 시 이미지를 다시 다운로드해야 할 수 있습니다.

### 오래된 프로젝트 삭제

Takdi 앱(http://localhost:3000)에서 더 이상 필요 없는 프로젝트를 삭제하면 업로드된 이미지 공간이 회복됩니다.

### Docker Desktop 디스크 사용량 확인

Docker Desktop → Settings → Resources → Disk image size에서 Docker가 사용하는 디스크 공간을 확인할 수 있습니다.

---

## 업데이트 방법

### 자동 업데이트 (Watchtower)

Takdi는 **Watchtower**를 사용하여 자동으로 업데이트됩니다.

- Watchtower가 **5분 간격**으로 새 버전을 확인합니다
- 새 버전이 있으면 자동으로 다운로드하고 컨테이너를 재시작합니다
- **별도 작업 불필요**: Docker가 실행 중이면 자동으로 업데이트됩니다

### 자동 업데이트 상태 확인

```bash
cd ~/takdi

# Watchtower 로그 확인
docker compose logs --tail=20 watchtower
```

### 수동 업데이트

자동 업데이트를 기다리지 않고 즉시 업데이트하려면:

```bash
cd ~/takdi

# 최신 이미지 다운로드
docker compose pull

# 컨테이너 재시작 (새 이미지 적용)
docker compose up -d
```

### 업데이트 후 확인

```bash
cd ~/takdi

# 컨테이너가 정상 실행 중인지 확인
docker compose ps
```

모든 컨테이너의 Status가 `Up`이면 정상입니다.
http://localhost:3000 에 접속하여 정상 동작을 확인합니다.

---

## Mac이 재시작된 후

### Docker Desktop 자동 시작이 설정된 경우

Docker Desktop이 자동 시작되면 앱도 자동으로 시작됩니다.

1. Mac 재시작 후 약 **2-3분** 기다립니다 (Docker Desktop 시작 + 컨테이너 시작 시간)
2. http://localhost:3000 에 접속하여 확인합니다

### Docker Desktop 자동 시작 설정 확인

1. Docker Desktop 열기 (상단 메뉴바 고래 아이콘)
2. **Settings** (톱니바퀴) 클릭
3. **General** 탭
4. **Start Docker Desktop when you sign in to your computer** 항목이 **체크**되어 있는지 확인

### 자동 시작이 안 되는 경우

```bash
cd ~/takdi

# 수동으로 컨테이너 시작
docker compose up -d

# 상태 확인
docker compose ps
```

### Mac 재시작 후 체크리스트

1. Docker Desktop이 실행되었는지 확인 (상단 메뉴바 고래 아이콘)
2. 고래 아이콘이 멈출 때까지 기다림 (움직이면 아직 시작 중)
3. http://localhost:3000 접속 확인
4. NAS가 마운트되었는지 확인 (`ls /Volumes/takdi`)
   - 마운트 안 됨: Finder → 이동 → 서버에 연결 → `smb://NAS주소/takdi`

---

## 추가 유용한 명령어

### 컨테이너 상태 한눈에 보기

```bash
cd ~/takdi
docker compose ps
```

### 특정 컨테이너만 재시작

```bash
cd ~/takdi

# 앱만 재시작
docker compose restart app

# ComfyUI만 재시작
docker compose restart comfyui
```

### Docker Desktop 완전 재시작

Docker 자체에 문제가 있을 때:

1. 상단 메뉴바 Docker 아이콘(고래) 클릭
2. **Quit Docker Desktop** 클릭
3. 약 10초 후 **Finder** → **응용 프로그램** → **Docker** 더블클릭

### 시스템 리소스 확인

```bash
# CPU 및 메모리 사용량 확인
top -l 1 | head -10

# 디스크 사용량 확인
df -h /
```

---

## 긴급 상황 대처

### 아무것도 작동하지 않을 때

최후의 수단으로 모든 것을 완전히 재시작합니다:

```bash
cd ~/takdi

# 1. 모든 컨테이너 완전 중지 및 삭제
docker compose down

# 2. Docker 캐시 정리
docker system prune -f

# 3. 다시 시작
docker compose up -d

# 4. 2-3분 대기 후 확인
docker compose ps
```

http://localhost:3000 에 접속하여 확인합니다.

### 그래도 안 되면

1. Mac을 재시작합니다
2. Docker Desktop이 완전히 시작될 때까지 기다립니다 (2-3분)
3. 터미널에서:
   ```bash
   cd ~/takdi
   docker compose up -d
   ```
4. 2분 후 http://localhost:3000 접속

### 데이터가 손실된 것 같으면

NAS 백업에서 복원할 수 있습니다. [NAS-BACKUP.md](./NAS-BACKUP.md)의 **복원 절차**를 참고하세요.
