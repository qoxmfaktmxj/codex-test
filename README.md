# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-05-17 | 벽돌 깨기 | 좌우로 받침대를 움직여 공을 튕기고 모든 벽돌을 깨는 게임입니다. |
| 2026-05-16 | 스네이크 | 방향을 바꾸며 먹이를 먹고 목표 길이까지 버티는 게임입니다. |
| 2026-05-15 | 사이먼 기억력 | 표시된 한글 색 순서를 외워 같은 순서로 누르는 기억력 게임입니다. |
| 2026-05-15 | 스네이크 | 방향으로 뱀을 움직여 먹이를 먹고 점수를 올리는 게임입니다. |
| 2026-05-15 | 숫자 퍼즐 | 빈 칸 옆 숫자를 밀어 1부터 8까지 순서대로 맞추는 퍼즐입니다. |

## 최근 게임 화면

### 벽돌 깨기

![벽돌 깨기 게임 화면](daily/2026-05-17-breakout/screenshot.png)

### 스네이크

![스네이크 게임 화면](daily/2026-05-16-snake/screenshot.png)

### 사이먼 기억력

![사이먼 기억력 게임 화면](daily/2026-05-15-simon-memory/screenshot.png)

### 스네이크

![스네이크 게임 화면](daily/2026-05-15-snake/screenshot.svg)

### 숫자 퍼즐

![숫자 퍼즐 게임 화면](daily/2026-05-15-number-puzzle/screenshot.svg)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-05-17-breakout/game-logic.test.js
node daily/2026-05-16-snake/game-logic.test.js
node daily/2026-05-15-simon-memory/game-logic.test.js
node daily/2026-05-15-snake/game-logic.test.js
node daily/2026-05-15-number-puzzle/game-logic.test.js
```
