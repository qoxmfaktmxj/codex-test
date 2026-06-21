# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-06-21 | 컵 속 공 찾기 | 세 개의 컵을 섞은 뒤 공이 숨어 있는 컵을 기억해 맞히는 고전 셸 게임입니다. |
| 2026-06-20 | 오목 | 흑돌과 백돌을 번갈아 놓고 가로, 세로, 대각선으로 다섯 돌을 먼저 잇는 고전 바둑판 게임입니다. |
| 2026-06-19 | 뱀과 사다리 | 주사위를 굴려 사다리는 오르고 뱀은 피하며 36번 칸에 먼저 도착하는 고전 보드 게임입니다. |
| 2026-06-18 | 색깔 채우기 | 왼쪽 위 영역의 색을 바꾸며 이어진 칸을 흡수해 제한 이동 안에 모든 칸을 같은 색으로 만드는 퍼즐입니다. |
| 2026-06-17 | 카드 전쟁 | 나와 컴퓨터가 한 장씩 카드를 뽑아 더 높은 등급으로 라운드 점수를 가져가는 고전 카드 게임입니다. |
| 2026-06-16 | 만칼라 | 내 쪽 홈의 돌을 반시계 방향으로 나누어 놓고 저장소에 더 많은 돌을 모으는 고전 보드 게임입니다. |
| 2026-06-15 | 점과 상자 | 점 사이에 선을 번갈아 긋고 네 변이 닫힌 칸을 차지해 더 많은 상자를 모으는 종이 게임입니다. |
| 2026-06-14 | 미니 스도쿠 | 4x4 칸에 1부터 4까지 숫자를 채워 행, 열, 작은 구역이 겹치지 않게 만드는 퍼즐입니다. |
| 2026-06-13 | 주사위 포커 | 다섯 주사위를 세 번까지 굴리고 고전 포커 조합을 골라 최고 점수를 노리는 게임입니다. |
| 2026-06-12 | 높낮이 카드 | 현재 카드보다 다음 카드가 높을지 낮을지 맞히며 연속 정답 기록에 도전하는 카드 게임입니다. |

## 최근 게임 화면

### 컵 속 공 찾기

![컵 속 공 찾기 게임 화면](daily/2026-06-21-shell-game/screenshot.png)

### 오목

![오목 게임 화면](daily/2026-06-20-gomoku/screenshot.png)

### 뱀과 사다리

![뱀과 사다리 게임 화면](daily/2026-06-19-snakes-and-ladders/screenshot.png)

### 색깔 채우기

![색깔 채우기 게임 화면](daily/2026-06-18-color-flood/screenshot.png)

### 카드 전쟁

![카드 전쟁 게임 화면](daily/2026-06-17-card-war/screenshot.png)

### 만칼라

![만칼라 게임 화면](daily/2026-06-16-mancala/screenshot.png)

### 점과 상자

![점과 상자 게임 화면](daily/2026-06-15-dots-and-boxes/screenshot.png)

### 미니 스도쿠

![미니 스도쿠 게임 화면](daily/2026-06-14-mini-sudoku/screenshot.png)

### 주사위 포커

![주사위 포커 게임 화면](daily/2026-06-13-dice-poker/screenshot.png)

### 높낮이 카드

![높낮이 카드 게임 화면](daily/2026-06-12-high-low-card/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-06-21-shell-game/game-logic.test.js
node daily/2026-06-20-gomoku/game-logic.test.js
node daily/2026-06-19-snakes-and-ladders/game-logic.test.js
node daily/2026-06-18-color-flood/game-logic.test.js
node daily/2026-06-17-card-war/game-logic.test.js
node daily/2026-06-16-mancala/game-logic.test.js
node daily/2026-06-15-dots-and-boxes/game-logic.test.js
node daily/2026-06-14-mini-sudoku/game-logic.test.js
node daily/2026-06-13-dice-poker/game-logic.test.js
node daily/2026-06-12-high-low-card/game-logic.test.js
```
