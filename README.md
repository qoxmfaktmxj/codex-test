# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-05-25 | 2048 퍼즐 | 같은 숫자 타일을 밀어 합치고 2048 타일을 만드는 숫자 퍼즐입니다. |
| 2026-05-24 | 네 줄 잇기 | 열을 골라 말을 떨어뜨리고 같은 색 말 네 개를 먼저 잇는 보드 게임입니다. |
| 2026-05-23 | 블랙잭 21 | 카드를 받아 21에 가깝게 만들고 딜러보다 높은 점수로 승부하는 카드 게임입니다. |
| 2026-05-22 | 퐁 | 위아래 받침대로 공을 받아치며 세 점을 먼저 노리는 고전 탁구 게임입니다. |
| 2026-05-21 | 지뢰 찾기 | 숨어 있는 지뢰를 피해 모든 안전한 칸을 여는 추리 게임입니다. |
| 2026-05-20 | 개구리 건너기 | 자동차가 오가는 길을 피해 개구리를 위쪽 연못까지 보내는 게임입니다. |
| 2026-05-19 | 우주 침략자 | 좌우로 움직이며 레이저를 쏴 내려오는 침략자를 모두 막는 게임입니다. |
| 2026-05-18 | 두더지 잡기 | 튀어나온 두더지를 눌러 점수를 올리고 실수 다섯 번 전에 오래 버티는 게임입니다. |
| 2026-05-17 | 벽돌 깨기 | 좌우로 받침대를 움직여 공을 튕기고 모든 벽돌을 깨는 게임입니다. |
| 2026-05-16 | 스네이크 | 방향을 바꾸며 먹이를 먹고 목표 길이까지 버티는 게임입니다. |

## 최근 게임 화면

### 2048 퍼즐

![2048 퍼즐 게임 화면](daily/2026-05-25-2048-puzzle/screenshot.png)

### 네 줄 잇기

![네 줄 잇기 게임 화면](daily/2026-05-24-connect-four/screenshot.png)

### 블랙잭 21

![블랙잭 21 게임 화면](daily/2026-05-23-blackjack/screenshot.png)

### 퐁

![퐁 게임 화면](daily/2026-05-22-pong/screenshot.png)

### 지뢰 찾기

![지뢰 찾기 게임 화면](daily/2026-05-21-minesweeper/screenshot.png)

### 개구리 건너기

![개구리 건너기 게임 화면](daily/2026-05-20-frogger/screenshot.png)

### 우주 침략자

![우주 침략자 게임 화면](daily/2026-05-19-space-invaders/screenshot.png)

### 두더지 잡기

![두더지 잡기 게임 화면](daily/2026-05-18-whack-a-mole/screenshot.png)

### 벽돌 깨기

![벽돌 깨기 게임 화면](daily/2026-05-17-breakout/screenshot.png)

### 스네이크

![스네이크 게임 화면](daily/2026-05-16-snake/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-05-25-2048-puzzle/game-logic.test.js
node daily/2026-05-24-connect-four/game-logic.test.js
node daily/2026-05-23-blackjack/game-logic.test.js
node daily/2026-05-22-pong/game-logic.test.js
node daily/2026-05-21-minesweeper/game-logic.test.js
node daily/2026-05-20-frogger/game-logic.test.js
node daily/2026-05-19-space-invaders/game-logic.test.js
node daily/2026-05-18-whack-a-mole/game-logic.test.js
node daily/2026-05-17-breakout/game-logic.test.js
node daily/2026-05-16-snake/game-logic.test.js
```
