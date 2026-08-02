# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-08-02 | 님 | 세 더미 중 하나에서 원하는 만큼 돌을 가져가 마지막 돌을 먼저 차지하는 고전 전략 게임입니다. |
| 2026-08-01 | 무 토레레 | 아홉 교차점에서 말을 인접한 빈자리로 움직여 상대가 더 이상 움직이지 못하게 만드는 마오리 고전 전략 게임입니다. |
| 2026-07-31 | 세 남자 모리스 | 말 세 개를 놓고 인접한 교차점으로 움직이며 가로·세로·대각선 한 줄을 먼저 완성하는 고전 삼목 게임입니다. |
| 2026-07-30 | 세네트 | 막대를 던져 말을 움직이고, 상대 말의 보호를 피해 세 말을 모두 말판 밖으로 먼저 보내는 고대 이집트 경주 게임입니다. |
| 2026-07-29 | 알케르케 | 5x5 연결선 위에서 말을 한 칸 옮기거나 상대 말을 뛰어넘어 잡으며, 상대 말을 모두 없애는 고전 말잡기 게임입니다. |
| 2026-07-28 | 페그 솔리테어 | 십자형 말판에서 말 하나를 뛰어넘어 없애며 마지막에 말 하나만 남기는 고전 퍼즐입니다. |
| 2026-07-27 | 미니 체커 | 킹 승격과 필수·연속 잡기를 뺀 간단 규칙으로, 흑돌과 백돌을 대각선으로 움직여 상대 말을 모두 잡는 고전 보드게임입니다. |
| 2026-07-21 | 라틴 사각형 | 4x4 말판에 1부터 4까지 숫자를 채워 각 행과 열에 같은 숫자가 한 번씩만 나오게 만드는 고전 숫자 퍼즐입니다. |
| 2026-07-20 | 마방진 15 | 1부터 9까지 숫자를 3x3 말판에 한 번씩 놓아 모든 가로, 세로, 대각선의 합을 15로 맞추는 고전 숫자 퍼즐입니다. |
| 2026-07-19 | 카드 열 맞추기 | 5x5 말판에 카드를 한 장씩 놓아 각 행과 열을 포커 족보로 만들고, 열 줄의 점수 합계를 높이는 고전 카드 퍼즐입니다. |

## 최근 게임 화면

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

### 라틴 사각형

![라틴 사각형 게임 화면](daily/2026-07-21-latin-square/screenshot.png)

### 마방진 15

![마방진 15 게임 화면](daily/2026-07-20-magic-square/screenshot.png)

### 카드 열 맞추기

![카드 열 맞추기 게임 화면](daily/2026-07-19-poker-squares/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-08-02-nim/game-logic.test.js
node daily/2026-08-01-mu-torere/game-logic.test.js
node daily/2026-07-31-three-mens-morris/game-logic.test.js
node daily/2026-07-30-senet/game-logic.test.js
node daily/2026-07-29-alquerque/game-logic.test.js
node daily/2026-07-28-peg-solitaire/game-logic.test.js
node daily/2026-07-27-checkers/game-logic.test.js
node daily/2026-07-21-latin-square/game-logic.test.js
node daily/2026-07-20-magic-square/game-logic.test.js
node daily/2026-07-19-poker-squares/game-logic.test.js
```
