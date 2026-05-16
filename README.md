# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

## 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-04-24 | 틱택토 | 두 플레이어가 번갈아 3x3 칸에 표시를 놓는 게임입니다. |
| 2026-04-27 | 메모리 매치 | 카드를 뒤집어 같은 짝을 모두 찾는 게임입니다. |
| 2026-04-27 | 가위바위보 | 하나를 골라 컴퓨터와 라운드 점수를 겨루는 게임입니다. |
| 2026-04-27 | 숫자 야구 | 서로 다른 세 자리 숫자를 스트라이크와 볼 힌트로 맞히는 게임입니다. |
| 2026-04-29 | 행맨 | 한글 글자를 골라 숨겨진 단어를 맞히는 게임입니다. |
| 2026-05-11 | 불 끄기 | 칸을 눌러 주변 불을 함께 바꾸고 모든 불을 끄는 퍼즐입니다. |
| 2026-05-15 | 사이먼 기억력 | 표시된 색 순서를 외워 같은 순서로 누르는 기억력 게임입니다. |
| 2026-05-15 | 스네이크 | 방향키로 뱀을 움직여 먹이를 먹고 점수를 올리는 게임입니다. |
| 2026-05-16 | 스네이크 | 방향을 바꾸며 먹이를 먹고 목표 길이까지 버티는 게임입니다. |

## 게임 화면

### 틱택토

![틱택토 게임 화면](daily/2026-04-24-tic-tac-toe/screenshot.png)

### 메모리 매치

![메모리 매치 게임 화면](daily/2026-04-27-memory-match/screenshot.png)

### 가위바위보

![가위바위보 게임 화면](daily/2026-04-27-rock-paper-scissors/screenshot.png)

### 숫자 야구

![숫자 야구 게임 화면](daily/2026-04-27-number-baseball/screenshot.svg)

### 행맨

![행맨 게임 화면](daily/2026-04-29-hangman/screenshot.svg)

### 불 끄기

![불 끄기 게임 화면](daily/2026-05-11-lights-out/screenshot.svg)

### 사이먼 기억력

![사이먼 기억력 게임 화면](daily/2026-05-15-simon-memory/screenshot.png)

### 스네이크

![스네이크 게임 화면](daily/2026-05-15-snake/screenshot.svg)

### 스네이크

![스네이크 게임 화면](daily/2026-05-16-snake/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-04-24-tic-tac-toe/game-logic.test.js
node daily/2026-04-27-memory-match/game-logic.test.js
node daily/2026-04-27-rock-paper-scissors/game-logic.test.js
node daily/2026-04-27-number-baseball/game-logic.test.js
node daily/2026-04-29-hangman/game-logic.test.js
node daily/2026-05-11-lights-out/game-logic.test.js
node daily/2026-05-15-simon-memory/game-logic.test.js
node daily/2026-05-15-snake/game-logic.test.js
node daily/2026-05-16-snake/game-logic.test.js
```
