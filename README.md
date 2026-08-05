# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-08-05 | 러시 아워 | 자동차를 앞뒤로 움직여 길을 열고, 빨간 자동차를 오른쪽 탈출구로 보내는 고전 교통 퍼즐입니다. |
| 2026-08-04 | 코나네 | 검은 돌과 흰 돌을 번갈아 치운 뒤, 상대 말을 가로 또는 세로로 뛰어넘어 더 이상 움직이지 못하게 만드는 하와이 고전 전략 게임입니다. |
| 2026-08-03 | 헥스 | 파란 돌로 위와 아래를 연결하고, 상대가 빨간 돌로 왼쪽과 오른쪽을 잇기 전에 길을 완성하는 고전 연결 전략 게임입니다. |
| 2026-08-02 | 님 | 세 더미 중 하나에서 원하는 만큼 돌을 가져가 마지막 돌을 먼저 차지하는 고전 전략 게임입니다. |
| 2026-08-01 | 무 토레레 | 아홉 교차점에서 말을 인접한 빈자리로 움직여 상대가 더 이상 움직이지 못하게 만드는 마오리 고전 전략 게임입니다. |
| 2026-07-31 | 세 남자 모리스 | 말 세 개를 놓고 인접한 교차점으로 움직이며 가로·세로·대각선 한 줄을 먼저 완성하는 고전 삼목 게임입니다. |
| 2026-07-30 | 세네트 | 막대를 던져 말을 움직이고, 상대 말의 보호를 피해 세 말을 모두 말판 밖으로 먼저 보내는 고대 이집트 경주 게임입니다. |
| 2026-07-29 | 알케르케 | 5x5 연결선 위에서 말을 한 칸 옮기거나 상대 말을 뛰어넘어 잡으며, 상대 말을 모두 없애는 고전 말잡기 게임입니다. |
| 2026-07-28 | 페그 솔리테어 | 십자형 말판에서 말 하나를 뛰어넘어 없애며 마지막에 말 하나만 남기는 고전 퍼즐입니다. |
| 2026-07-27 | 미니 체커 | 킹 승격과 필수·연속 잡기를 뺀 간단 규칙으로, 흑돌과 백돌을 대각선으로 움직여 상대 말을 모두 잡는 고전 보드게임입니다. |

## 최근 게임 화면

### 러시 아워

![러시 아워 게임 화면](daily/2026-08-05-rush-hour/screenshot.png)

### 코나네

![코나네 게임 화면](daily/2026-08-04-konane/screenshot.png)

### 헥스

![헥스 게임 화면](daily/2026-08-03-hex/screenshot.png)

### 님

![님 게임 화면](daily/2026-08-02-nim/screenshot.png)

### 무 토레레

![무 토레레 게임 화면](daily/2026-08-01-mu-torere/screenshot.png)

### 세 남자 모리스

![세 남자 모리스 게임 화면](daily/2026-07-31-three-mens-morris/screenshot.png)

### 세네트

![세네트 게임 화면](daily/2026-07-30-senet/screenshot.png)

### 알케르케

![알케르케 게임 화면](daily/2026-07-29-alquerque/screenshot.png)

### 페그 솔리테어

![페그 솔리테어 게임 화면](daily/2026-07-28-peg-solitaire/screenshot.png)

### 미니 체커

![미니 체커 게임 화면](daily/2026-07-27-checkers/screenshot.svg)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-08-05-rush-hour/game-logic.test.js
node daily/2026-08-04-konane/game-logic.test.js
node daily/2026-08-03-hex/game-logic.test.js
node daily/2026-08-02-nim/game-logic.test.js
node daily/2026-08-01-mu-torere/game-logic.test.js
node daily/2026-07-31-three-mens-morris/game-logic.test.js
node daily/2026-07-30-senet/game-logic.test.js
node daily/2026-07-29-alquerque/game-logic.test.js
node daily/2026-07-28-peg-solitaire/game-logic.test.js
node daily/2026-07-27-checkers/game-logic.test.js
```
