# 바가텔 출시 검증

## 범위

기존 기본판과 비교판을 제거하고 canonical `daily/2026-09-13-bagatelle`에 새 물리 게임 하나로 교체했다. 이전 구현의 Git 이력은 보존했다. 제작 전 기준 커밋은 `84e0de1e7a51b8836b33ccbb414e24d0a6238b7d`다. README/archive의 깨진 로컬 링크와 비교판 링크는 0개다. 아카이브에는 제거할 바가텔 항목이 없었다.

## 테스트

- TDD: 새 계약 12개를 먼저 작성하고 기존 구현에서 실패 확인(`evidence/tdd-red.txt`), 구현 후 12/12 통과(`evidence/tdd-green.txt`).
- 전체 `daily/*/game-logic.test.js`: 120개 파일 통과(`evidence/full-tests.txt`).
- 모든 정수 세기 20~100: 매 스텝 좌표/속도 유한성, 경계, 실제 득점, 유한 시간 종료. 최대 7.25초. 득점 분포는 10점 42개, 20점 22개, 50점 13개, 100점 4개 세기.
- 새 npm/package 의존성 없음. 정적 HTML/CSS/JS, 한글 UI. 물리 엔진은 Node 내장 테스트만으로 검증 가능.

## 독립 리뷰와 실제 모델

별도 Gateway 세션에서 리뷰 완료. `REVIEW.md`에 결과와 후속 조치 기록. Critical/Important 없음. 경미한 매 스텝 경계 검사 제안을 반영했다.

요청 모델과 실제 응답 모델 모두 `openai/gpt-6-astra`; 세션 thinking=`low`; terminal receipt `rerouted=false`; fallback 미사용. `evidence/model-verification.json`은 실제 런타임 영수증과 세션 상태를 추출한 기록이며 모델의 자기보고가 아니다. 최초 embedded 실행은 workspace migration 오류로 모델 호출 전에 실패했다. 전역 doctor/config 변경 없이 Gateway에서 복구했다.

## 실제 브라우저

Chrome + 이미 설치된 Playwright를 검증 도구로만 사용했다. desktop 키보드 발사/세기 조절/중복 발사 차단/진행 중 리셋, mobile 실제 터치 5구/합산/종료/재시작, reduced-motion 잔상 제거를 검증했다. 375/768/1024/1440에서 가로 넘침 없음. 페이지 예외 0개.

- [데스크톱](screenshot.png)
- [모바일](screenshot-mobile.png)
- [모바일 다섯 공 종료](evidence/mobile-finished.png)
- [브라우저 검증 기록](evidence/browser-results.txt)
- 최근 7개 실제 캡처와 차별화 계획: `DESIGN.md` 및 `evidence/before-*.png`

## 정기 자동화

12:15 `b2f73dce-1cd8-4ed9-ae50-a47bea039ac6`, 13:15 `f91ab46b-a3be-4b59-8022-4642d92d8873`의 모델 `openai/gpt-6-astra`, thinking `low`, Asia/Seoul 시간표를 유지했다. 두 prompt에 실제 7개 화면 비교/사전 콘셉트/3개 이상 차별화/desktop-mobile 시각 리뷰와 유사 시 수정 절차를 추가하고 다시 읽어 저장값을 검증했다. 검증 시점 prompt 스냅샷은 `evidence/cron-*.json`.

workspace의 `scripts/codex-test-daily-game-runbook.md`도 같은 정책으로 편집했다. 코드/테스트만 재사용, 기존 UI 복제 금지; TDD/전체 테스트/리뷰/중복 방지/README/archive/push 규칙 유지. 기존 게임 존재 skip 예외는 이번 명시적 재제작에만 적용하며 정기 작업에는 적용하지 않는다.

## 배포 경로

GitHub Pages는 검증 시 404로 미구성이므로 사용하지 않는다. README는 Raw.githack의 공개 정적 실행 링크를 제공한다. 게임 구현 커밋 `7fa5337795768dbc3435b0094e57fe448f2ad2c7`의 [고정 플레이 URL](https://raw.githack.com/qoxmfaktmxj/codex-test/7fa5337795768dbc3435b0094e57fe448f2ad2c7/daily/2026-09-13-bagatelle/index.html)에서 실제 리소스 로딩과 발사/득점/리셋을 검증했다. 첫 접속 외부 뷰어 안내의 Open the page 클릭 후 정상 진입했다. JS/CSS 모두 HTTP 200 및 로컬 SHA256 일치, 한 공 50점/남은 공 4개, 리셋 후 5개, 페이지 예외 0개. Git 원격은 push 뒤 fetch하여 HEAD와 origin/main 일치 및 바가텔 폴더 한 개만 존재함을 확인했다. `evidence/public-release.json` 참고.
