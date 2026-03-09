# NAS 백업 전략

Last Updated: 2026-03-09

---

## 개요

Takdi의 데이터는 자동으로 NAS에 백업됩니다. 백업은 매일 새벽 3시에 자동 실행되며, 최근 30일분의 백업이 보존됩니다.

---

## 자동 백업

### 작동 방식

Docker의 **backup 컨테이너**가 매일 자동으로 백업을 실행합니다.

- **실행 시간**: 매일 새벽 3:00 AM
- **실행 주체**: Docker backup 컨테이너 (docker-compose에 포함)
- **별도 설정 불필요**: Docker 컨테이너가 실행 중이면 자동으로 백업됩니다

### 자동 백업 상태 확인

```bash
cd ~/takdi

# backup 컨테이너가 실행 중인지 확인
docker compose ps backup
```

Status가 `Up` 또는 `running`이면 자동 백업이 활성화된 상태입니다.

### 최근 백업 로그 확인

```bash
cd ~/takdi

# 최근 백업 로그 보기
docker compose logs --tail=20 backup
```

"Backup completed successfully" 또는 유사한 성공 메시지가 보이면 정상입니다.

---

## 백업 내용

### 백업되는 데이터

| 항목 | 설명 | 위치 |
|------|------|------|
| **SQLite 데이터베이스** | 프로젝트, 설정, 사용자 데이터 | 앱 컨테이너 내부 |
| **uploads 폴더** | 업로드된 이미지, 생성된 이미지 | 앱 컨테이너 내부 |

### 백업되지 않는 데이터

| 항목 | 이유 |
|------|------|
| AI 모델 파일 | 용량이 크고 재다운로드 가능 |
| Docker 이미지 | 재다운로드 가능 |
| 임시 파일 | 필요하지 않음 |

---

## 30일 보존 정책

- 백업 파일은 **최근 30일분**만 유지됩니다
- 30일이 지난 백업은 자동으로 삭제됩니다
- 디스크 공간 절약을 위한 자동 정책입니다

### 백업 파일 이름 형식

```
takdi-backup-YYYY-MM-DD.tar.gz
```

예시:
```
takdi-backup-2026-03-09.tar.gz
takdi-backup-2026-03-08.tar.gz
takdi-backup-2026-03-07.tar.gz
...
```

---

## 수동 백업

자동 백업 외에 수동으로 즉시 백업할 수 있습니다.

### 실행 방법

```bash
cd ~/takdi

# 수동 백업 실행
bash scripts/backup.sh
```

### 수동 백업이 필요한 경우

- 중요한 변경사항을 적용하기 전
- 시스템 업데이트 전
- 문제가 발생하기 전 안전장치로

### 수동 백업 확인

백업 완료 후 NAS에서 파일을 확인합니다:

```bash
# NAS 백업 디렉토리 확인
ls -la /Volumes/takdi/backups/
```

방금 생성된 백업 파일이 보이면 성공입니다.

---

## NAS 백업 디렉토리 구조

NAS의 `takdi` 공유 폴더 안에 다음과 같은 구조로 백업됩니다:

```
/Volumes/takdi/
  └── backups/
      ├── takdi-backup-2026-03-09.tar.gz    (오늘 백업)
      ├── takdi-backup-2026-03-08.tar.gz    (어제 백업)
      ├── takdi-backup-2026-03-07.tar.gz
      ├── ...
      └── takdi-backup-2026-02-07.tar.gz    (30일 전 - 다음 백업 시 삭제됨)
```

### 백업 파일 크기 확인

```bash
# 각 백업 파일의 크기 확인
ls -lh /Volumes/takdi/backups/
```

### NAS 남은 공간 확인

```bash
df -h /Volumes/takdi
```

---

## 복원 절차

백업에서 데이터를 복원해야 하는 경우 (예: 데이터 손실, 새 Mac 설정 등):

### 사전 준비

- NAS가 마운트되어 있는지 확인 (`ls /Volumes/takdi/backups/`)
- 복원할 백업 파일 날짜를 결정

### DB 복원

**1단계: 앱 컨테이너 중지**

```bash
cd ~/takdi

# 앱 중지 (데이터 손상 방지)
docker compose stop app
```

**2단계: 백업 파일에서 DB 추출**

```bash
# 복원할 날짜의 백업 파일 지정 (날짜를 변경하세요)
BACKUP_FILE="/Volumes/takdi/backups/takdi-backup-2026-03-09.tar.gz"

# 임시 디렉토리에 압축 해제
mkdir -p /tmp/takdi-restore
tar -xzf "$BACKUP_FILE" -C /tmp/takdi-restore

# 추출된 파일 확인
ls -la /tmp/takdi-restore/
```

**3단계: DB 파일 복원**

```bash
cd ~/takdi

# 기존 DB 백업 (안전장치)
docker compose exec app cp /app/data/takdi.db /app/data/takdi.db.before-restore 2>/dev/null || true

# 복원된 DB를 컨테이너에 복사
docker cp /tmp/takdi-restore/takdi.db $(docker compose ps -q app):/app/data/takdi.db
```

### uploads 복원

```bash
cd ~/takdi

# 복원된 uploads를 컨테이너에 복사
docker cp /tmp/takdi-restore/uploads/. $(docker compose ps -q app):/app/uploads/
```

### 복원 완료 및 확인

```bash
cd ~/takdi

# 앱 다시 시작
docker compose start app

# 임시 디렉토리 정리
rm -rf /tmp/takdi-restore
```

http://localhost:3000 에 접속하여 데이터가 정상적으로 복원되었는지 확인합니다.

### 전체 복원 (새 Mac에서)

새 Mac에 Takdi를 처음 설치한 후 기존 데이터를 복원하는 경우:

```bash
# 1. MAC-MINI-SETUP.md의 1~8단계를 모두 완료합니다

# 2. NAS가 마운트되어 있는지 확인
ls /Volumes/takdi/backups/

# 3. 가장 최근 백업 파일 확인
ls -lt /Volumes/takdi/backups/ | head -5

# 4. 앱 중지
cd ~/takdi
docker compose stop app

# 5. 백업에서 복원 (날짜를 최신 백업으로 변경)
BACKUP_FILE="/Volumes/takdi/backups/takdi-backup-2026-03-09.tar.gz"
mkdir -p /tmp/takdi-restore
tar -xzf "$BACKUP_FILE" -C /tmp/takdi-restore

# 6. DB 복원
docker cp /tmp/takdi-restore/takdi.db $(docker compose ps -q app):/app/data/takdi.db

# 7. uploads 복원
docker cp /tmp/takdi-restore/uploads/. $(docker compose ps -q app):/app/uploads/

# 8. 앱 시작
docker compose start app

# 9. 정리
rm -rf /tmp/takdi-restore

# 10. http://localhost:3000 에서 확인
```

---

## 백업 확인 방법

### 일일 확인 (권장)

매일 확인할 필요는 없지만, 주기적으로 백업이 정상 동작하는지 확인하는 것이 좋습니다.

```bash
# 1. 최근 백업 파일 확인 (오늘 날짜의 파일이 있는지)
ls -la /Volumes/takdi/backups/ | tail -5

# 2. 백업 파일 크기가 0이 아닌지 확인
ls -lh /Volumes/takdi/backups/takdi-backup-$(date +%Y-%m-%d).tar.gz
```

### 백업 무결성 확인

백업 파일이 손상되지 않았는지 확인:

```bash
# 백업 파일 내용 목록 확인 (압축을 풀지 않고 목록만 표시)
tar -tzf /Volumes/takdi/backups/takdi-backup-2026-03-09.tar.gz
```

파일 목록이 정상적으로 표시되면 백업 파일이 정상입니다.
"Error" 또는 "corrupted" 메시지가 나오면 해당 백업 파일이 손상된 것입니다. 다른 날짜의 백업을 사용하세요.

### 백업이 실행되지 않을 때

```bash
cd ~/takdi

# 1. backup 컨테이너 상태 확인
docker compose ps backup

# 2. backup 컨테이너 로그 확인
docker compose logs --tail=50 backup

# 3. NAS 마운트 확인
ls /Volumes/takdi/backups/

# 4. backup 컨테이너 재시작
docker compose restart backup
```

흔한 원인:
- **NAS가 마운트되지 않음**: Mac 재시작 후 NAS 자동 마운트가 실패한 경우. Finder에서 수동으로 NAS에 연결합니다.
- **NAS 공간 부족**: NAS의 남은 공간을 확인합니다.
- **Docker가 실행되지 않음**: Docker Desktop이 실행 중인지 확인합니다.
