# 검증 증거

- `before-*.png`: 교체 전 최신 7개 게임을 1440×1000 Chrome에서 실행한 실제 캡처. 삭제된 구현을 다시 서비스하지 않으며 시각 비교 증거만 보존한다.
- `capture-recent.cjs`: 최초 캡처 도구. 기존 증거 덮어쓰기를 차단한다. 기준 커밋은 상위 VERIFICATION.md 참고.
- `browser-check.cjs`: 로컬 HTTP 서버와 Chrome을 시작하고, 검증 후 둘 다 종료한다. Node 내장 HTTP 서버 사용.
- 실행 예: `PLAYWRIGHT_MODULE=/path/to/existing/playwright CHROME_PATH=/path/to/chrome node daily/2026-09-13-bagatelle/evidence/browser-check.cjs` (저장소 루트에서 실행)
- Playwright는 이미 설치된 외부 검증 도구이며 게임/저장소의 새 패키지 의존성이 아니다. 게임 자체는 브라우저만 있으면 실행된다.
- `model-verification.json`: 독립 리뷰 실제 실행 영수증의 필요한 항목만 보존. verbose bootstrap/인증 프로필 등 불필요한 메타데이터는 제외했다.
- `cron-*.json`: 이번 변경 대상 두 자동화의 시간/모델/prompt 재조회 기록. 변경하지 않은 전달 대상이나 운영 이력은 포함하지 않았다.
