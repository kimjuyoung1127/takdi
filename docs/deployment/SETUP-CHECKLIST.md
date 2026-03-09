# 셋업 체크리스트

Last Updated: 2026-03-09

---

## 개요

Mac Mini M4에 Takdi를 설치하기 위한 체크리스트입니다.
각 항목을 순서대로 진행하고, 완료되면 체크 표시합니다.

자세한 절차는 [MAC-MINI-SETUP.md](./MAC-MINI-SETUP.md)를 참고하세요.

---

## 체크리스트

### 필수 항목

- [ ] **macOS 초기 설정 완료** (5분)
  - 자동 업데이트 비활성화
  - 절전 모드 비활성화
  - 참고: [MAC-MINI-SETUP.md → 1단계](./MAC-MINI-SETUP.md#1단계-macos-초기-설정)

- [ ] **Docker Desktop 설치 및 실행** (10분)
  - Docker Desktop 다운로드 (Apple Silicon 버전)
  - 설치 및 실행
  - 메모리 16GB 이상 할당
  - `docker --version` 으로 확인
  - 참고: [MAC-MINI-SETUP.md → 2단계](./MAC-MINI-SETUP.md#2단계-docker-desktop-설치)

- [ ] **Git 설치** (5분)
  - `xcode-select --install` 실행
  - `git --version` 으로 확인
  - 참고: [MAC-MINI-SETUP.md → 5단계](./MAC-MINI-SETUP.md#5단계-git-설치)

- [ ] **프로젝트 클론** (2분)
  - `git clone [repo-url] ~/takdi`
  - `ls ~/takdi`로 파일 확인
  - 참고: [MAC-MINI-SETUP.md → 6단계](./MAC-MINI-SETUP.md#6단계-프로젝트-클론)

- [ ] **.env 파일 설정** (3분)
  - `.env.example`을 `.env`로 복사
  - GEMINI_API_KEY 입력
  - IMAGE_PROVIDER 설정
  - 참고: [MAC-MINI-SETUP.md → 7단계](./MAC-MINI-SETUP.md#7단계-환경-설정-env-파일)

- [ ] **셋업 스크립트 실행** (10-20분)
  - `bash scripts/setup-mac.sh`
  - 완료 메시지 확인
  - 참고: [MAC-MINI-SETUP.md → 8단계](./MAC-MINI-SETUP.md#8단계-셋업-스크립트-실행)

- [ ] **모델 다운로드** (30-60분, 인터넷 속도에 따라)
  - `bash scripts/download-models.sh`
  - FLUX.1 Dev, FLUX.1 Schnell, BRIA RMBG 다운로드
  - 참고: [MAC-MINI-SETUP.md → 9단계](./MAC-MINI-SETUP.md#9단계-모델-다운로드)

- [ ] **http://localhost:3000 접속 확인** (1분)
  - 웹 브라우저에서 Takdi 화면 표시 확인
  - 참고: [MAC-MINI-SETUP.md → 10단계](./MAC-MINI-SETUP.md#10단계-동작-확인)

- [ ] **테스트 이미지 생성 확인** (5분)
  - Takdi에서 프로젝트 생성
  - 이미지 생성 기능 테스트
  - 이미지가 정상적으로 생성되는지 확인

### 선택 항목

- [ ] **NAS 마운트 설정** (10분) — NAS를 사용하는 경우
  - Finder → 이동 → 서버에 연결
  - `smb://NAS주소/takdi` 입력
  - 연결 확인
  - 참고: [MAC-MINI-SETUP.md → 3단계](./MAC-MINI-SETUP.md#3단계-nas-마운트-설정)

- [ ] **NAS 자동 마운트 설정** (5분) — NAS를 사용하는 경우
  - 시스템 설정 → 로그인 항목에 추가
  - Mac 재시작 후 자동 마운트 확인
  - 참고: [MAC-MINI-SETUP.md → 4단계](./MAC-MINI-SETUP.md#4단계-nas-자동-마운트-설정)

- [ ] **Docker Desktop 자동 시작 설정** (2분)
  - Docker Desktop → Settings → General
  - "Start Docker Desktop when you sign in" 체크
  - 참고: [RUNBOOK.md → Mac이 재시작된 후](./RUNBOOK.md#mac이-재시작된-후)

---

## 예상 소요 시간

| 구분 | 항목 | 소요 시간 |
|------|------|-----------|
| 필수 | macOS 초기 설정 | 5분 |
| 필수 | Docker Desktop 설치 | 10분 |
| 필수 | Git 설치 | 5분 |
| 필수 | 프로젝트 클론 | 2분 |
| 필수 | .env 파일 설정 | 3분 |
| 필수 | 셋업 스크립트 실행 | 10-20분 |
| 필수 | 모델 다운로드 | 30-60분 |
| 필수 | 접속 확인 | 1분 |
| 필수 | 테스트 이미지 생성 | 5분 |
| 선택 | NAS 마운트 설정 | 10분 |
| 선택 | NAS 자동 마운트 설정 | 5분 |
| 선택 | Docker Desktop 자동 시작 | 2분 |
| | **합계** | **약 90-120분** |

> **참고**: 모델 다운로드가 가장 오래 걸립니다 (인터넷 속도에 따라 30-60분). 유선 인터넷(이더넷) 연결을 권장합니다.

---

## 설치 완료 후

설치가 완료되면 다음 문서를 참고하세요:

- [RUNBOOK.md](./RUNBOOK.md) — 일상 운영 매뉴얼 (시작/정지/재시작/문제해결)
- [COMFYUI-GUIDE.md](./COMFYUI-GUIDE.md) — ComfyUI 모델 및 워크플로우 안내
- [PROVIDER-CONFIG.md](./PROVIDER-CONFIG.md) — 이미지 생성 Provider 변경 방법
- [NAS-BACKUP.md](./NAS-BACKUP.md) — 백업 및 복원 안내

---

## 문제 발생 시

설치 도중 문제가 발생하면:

1. **에러 메시지를 복사**합니다 (터미널에서 텍스트를 드래그하여 선택 → `Cmd + C`)
2. 각 단계의 **"이 단계에서 에러가 나면?"** 섹션을 확인합니다
3. [RUNBOOK.md](./RUNBOOK.md)의 해당 섹션을 확인합니다
4. 해결되지 않으면 관리자에게 에러 메시지와 함께 문의합니다
