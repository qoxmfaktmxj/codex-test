# 아스트라 비교판 검증

- 2026-09-13 원본 바가텔 폴더를 수정하지 않고 별도 제작. 새 의존성 없음.
- 실행 모델: session_status가 07:55 및 07:58 UTC에 `openai/gpt-6-astra`, `think low`를 표시.
- fallback 설정: `openai/gpt-5.6-terra`가 후보로 표시됨. 실제 fallback 전환 증거는 없으며, 상태 조회만으로 모든 요청의 내부 라우팅까지 증명하지는 않음.
- TDD: 구현 전 새 테스트에서 MODULE_NOT_FOUND 실패 확인. 구현 후 통과.
- 전체 `daily/*/game-logic.test.js`: 121개 파일 모두 통과.
- 별도 리뷰어: Critical/Important 없음. 27,621개 위치·세기 조합 검증, 최대 783프레임, 강제 배수 0건. 권고한 점수 배치 텍스트 추가 완료.
- 실제 Chrome headless + CDP: 5회 발사, 중복 발사 잠금, 종료(50점), 진행 중 재시작 통과. 모바일 390px 가로 넘침 없음.
- OpenClaw 브라우저 도구의 탐색 정책 제한으로 로컬 Chrome을 사용. 초기 CDP 확장 프로그램 대상 선택 오류를 page 대상 선택으로 수정 후 성공.
- screenshot.png는 실제 Chrome 화면이며 육안 확인 완료.
- README 최근 게임 10개 유지, 미니 할마를 아카이브로 이동.
