# 🍁 maple-server

이벤트 기반 보상 시스템 백엔드. NestJS 기반 MSA 구조로 설계되었으며, JWT 인증과 역할 기반 권한 제어를 포함합니다.  
유저의 게임 활동 조건을 평가해 보상을 지급하며, **유저 요청 기반 트리거**와 **자동 지급 트리거**를 모두 지원합니다.

## 🏗️ 프로젝트 구조

```
apps/
├── auth/        # 유저 인증 및 로그인/회원가입 기능
├── event/       # 이벤트, 보상, 신청 처리 및 조건 검증
├── gateway/     # 인증 및 권한 검사 후 요청 라우팅
````
<p align="center">
  <img width="595" alt="스크린샷 2025-05-20 오전 2 04 06" src="https://github.com/user-attachments/assets/7bd952b7-e919-46de-8c9e-fe403e205fc0" />
</p>
- 전체 구조는 **gateway → auth 또는 event**로 요청을 전달하는 형태입니다.
- 모든 서비스는 MongoDB를 사용하며, 실제 배포 환경에서는 서비스별 데이터베이스 분리를 권장하지만, 현재는 하나의 DB를 네임스페이스만 분리하여 사용합니다.
- gateway 외부에서 auth/event를 직접 호출하는 것은 막는 것이 보안상 이상적이나, 데모 구현에서는 시간 관계상 해당 제한은 적용되지 않았습니다.

---

## 🚀 실행 방법 (Docker Compose)

```bash
npm install
docker compose up --build
````

* Auth API (직접 호출 시): [http://localhost:3000](http://localhost:3000)
* Gateway API: [http://localhost:3001](http://localhost:3001)
* Event API (직접 호출 시): [http://localhost:3002](http://localhost:3002)
* Swagger (Event): [http://localhost:3002/api](http://localhost:3002/api)

## 🧾 환경 변수 설정
모든 서비스는 루트 디렉토리 (./)에 위치한 .env 파일을 기준으로 환경변수를 로드합니다. 다음 값을 포함해야 정상 동작합니다:
```text
# auth 전용
AUTH_MONGO_URI=mongodb://localhost:27017/maple-auth

# event 전용
EVENT_MONGO_URI=mongodb://localhost:27017/maple-event

# gateway + auth + event 공통
JWT_SECRET=bimilim

# base url
EVENT_SERVICE_URL=http://localhost:3002
AUTH_SERVICE_URL=http://localhost:3000
```
---

## 🔐 역할 기반 권한

| 역할       | 권한 설명          |
| -------- | -------------- |
| USER     | 보상 요청 가능       |
| OPERATOR | 이벤트 및 보상 등록 가능 |
| AUDITOR  | 보상 이력 조회만 가능   |
| ADMIN    | 모든 기능 접근 가능    |

---

## ✍️ 설계 배경 및 방향성

### 🎯 트리거 유형

이벤트 보상 처리는 다음 두 가지 트리거 방식에 대응하도록 설계되었습니다:

1. **ON\_DEMAND**
   유저가 직접 보상을 요청하면 조건을 평가하여 지급 여부를 판단합니다. 조건 충족 시 `PENDING` 상태로 기록되며, 이후 Admin Page를 통해 운영자가 수동으로 확정할 수 있습니다.

2. **AUTO**
   외부 시스템 또는 자동화된 분석 결과를 기반으로, 별도 검토 없이 자동으로 보상을 지급하는 구조입니다.
   예: 익스트림 칼로스 격파 칭호 보유자면 → 자동 SUCCESS 처리
   이 부분은 실제로 구현하진 않았습니다. 로직이 유사하기도 하며 제 생각으론 외부 서비스를 호출하여 보상을 지급하는게 맞다고 생각하는데, 외부 서비스가 없기에 호출을 어떤식으로 하는지 (HTTP, KAFKA...)가 중요하다고 생각했기 때문입니다.
   구현을 어떤식으로 할지에 대해서는 주석으로 달아뒀습니다.
   ```
   /**
   * event의 triggerType이 AUTO인 경우 createPendingClaim와 유사한 함수를 만들고
   * 함수 내부에서 보상을 지급해주는 실제 외부 서비스를 호출 한 후 응답 결과에 따라 보상을 자동으로 지급할 수 있습니다.
   * 다만 외부 서비스가 없기 때문에 구현 자체는 생략했습니다.
   * 응답 결과가 성공이면 바로 성공했다고 처리하면 되고 실패한다면 실패한거만 따로 모아서 스케줄러를 돌리거나 DLQ 같은 방식을 사용 할 수 있습니다.
   */
   ```

---

## 🔐 Auth Server

* `POST /auth/signup`: 회원가입 (이메일, 비밀번호, 닉네임, 역할 포함)
* `POST /auth/login`: 로그인 → JWT 발급

JWT Payload 구조:

```json
{
  "id": "<MongoDB User ID>",
  "email": "user@example.com",
  "role": "USER | OPERATOR | ADMIN | AUDITOR"
}
```

---

## 📦 Event Server

* Swagger 경로: `http://localhost:3002/api`
* 유저 정보는 실제 메이플스토리 유저가 아닌 더미 `UserService`를 통해 조회됩니다.
* 보상 지급은 외부 API 호출을 전제로 하며, 데모에서는 생략된 상태입니다. (게임 서버를 데이터를 가지고 있는 서비스를 호출 하는 방식)

### 주요 API 목록

| 메서드    | 경로                                        | 설명          | 권한                   |
| ------ | ----------------------------------------- | ----------- | -------------------- |
| POST   | /events                                   | 이벤트 등록      | OPERATOR, ADMIN      |
| PUT    | /events/\:id                              | 이벤트 수정      | OPERATOR, ADMIN      |
| PATCH  | /events/\:id/active                       | 이벤트 활성화 토글  | OPERATOR, ADMIN      |
| POST   | /events/\:eventId/rewards                 | 보상 등록       | OPERATOR, ADMIN      |
| PUT    | /events/\:eventId/rewards/\:rewardId      | 보상 수정       | OPERATOR, ADMIN      |
| DELETE | /events/\:eventId/rewards/\:rewardId      | 보상 삭제       | OPERATOR, ADMIN      |
| POST   | /events/\:eventId/claims                  | 유저 보상 요청    | USER                 |
| PATCH  | /events/\:eventId/claims/\:claimId/status | 보상 상태 수동 변경 | ADMIN                |
| GET    | /claims                                   | 전체 보상 이력 조회 | AUDITOR, ADMIN       |
| GET    | /claims/user/\:userId                     | 유저 보상 이력 조회 | USER, AUDITOR, ADMIN |

---

## 🧠 조건 평가 설계

* 조건은 현재 2가지만 구현했으며 하나는 비교 조건이며, 다른 하나는 업적의 유무 판단입니다. **새로운 조건 추가 시 코드를 확장하는 구조**입니다:

* 조건 평가는 `ConditionEvaluator`를 통해 수행되며, 비교 조건 및 업적 조건 모두 지원합니다.

* 비교 조건 예시 ) 레벨 220 이상
* 업적 조건 예시 ) 익스트림 칼로스 1회 처치 업적 유무

## 🧬 BigQuery 기반 자동 보상 설계 (미구현)

보다 운영 친화적인 구조를 위해 **BigQuery를 활용한 자동 보상 시스템**도 설계에는 포함하였습니다만 현재는 오버엔지니어링이 심하여 직접 구현까진 하지 않은 상태입니다.

* 이벤트 등록 시 SQL 쿼리를 함께 저장
* 주기적으로 BigQuery 쿼리를 실행해 대상 유저 ID 리스트 확보
* 별도 candidate 테이블에 저장
* 보상 요청 시 해당 테이블 기준으로 자동 SUCCESS 처리

* SQL만 작성해도 (아마 비개발자인) 운영자가 직접 보상 대상자를 제어할 수 있는 구조입니다.
* 넥슨처럼 대규모 로그 분석 환경에서는 현실적이고 확장성 높은 구조입니다.

## 🚧 미구현된 부분
* auth 및 event 서비스는 gateway를 통해서만 접근할 수 있도록 방화벽 또는 네트워크 ACL로 외부 접근을 제한해야 합니다.

* 현재 데모 구현에서는 시간 제약상 해당 제한이 적용되어 있지 않으며, 직접 API를 호출하는 것이 가능합니다.
  (http://localhost:3002/api 에 직접 접근 가능하지만, 실제 운영 환경에서는 막혀야 정상입니다.)

* Swagger는 dev 또는 local에서만 적용되게 해야하고 현재 dependency에 보안 이슈가 있지만 따로 작업하진 않았습니다.

---

## 🛠 기술 스택

* Node.js 18
* NestJS (Monorepo)
* MongoDB + Mongoose ODM (Docker 기반)
* JWT 인증 (`@nestjs/jwt`, `passport-jwt`)
* Swagger 문서화 (`@nestjs/swagger`)
* Docker, Docker Compose
