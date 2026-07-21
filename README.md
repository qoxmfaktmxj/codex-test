# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-07-21 | 라틴 사각형 | 4x4 말판에 1부터 4까지 숫자를 채워 각 행과 열에 같은 숫자가 한 번씩만 나오게 만드는 고전 숫자 퍼즐입니다. |
| 2026-07-20 | 마방진 15 | 1부터 9까지 숫자를 3x3 말판에 한 번씩 놓아 모든 가로, 세로, 대각선의 합을 15로 맞추는 고전 숫자 퍼즐입니다. |
| 2026-07-19 | 카드 열 맞추기 | 5x5 말판에 카드를 한 장씩 놓아 각 행과 열을 포커 족보로 만들고, 열 줄의 점수 합계를 높이는 고전 카드 퍼즐입니다. |
| 2026-07-18 | 돼지 주사위 | 주사위를 굴려 이번 차례 점수를 쌓고, 1이 나오기 전에 멈춰 저장하며 먼저 30점에 도달하는 고전 주사위 게임입니다. |
| 2026-07-17 | 시계 솔리테어 | 왕 더미에서 시작해 열린 카드 숫자의 더미로 이동하며, 왕 네 장이 먼저 나오기 전에 모든 카드를 여는 고전 카드 운세 게임입니다. |
| 2026-07-16 | 루도 미니 | 주사위에서 6을 굴려 말을 출발시키고, 상대 말을 잡으며 한 바퀴를 정확히 돌아 모든 말을 먼저 도착시키는 고전 경주 게임입니다. |
| 2026-07-15 | 불가리아 솔리테어 | 45장의 카드를 여러 더미로 나누고, 매 차례 각 더미에서 한 장씩 빼 새 더미를 만들며 1부터 9까지 계단 모양을 완성하는 고전 카드 퍼즐입니다. |
| 2026-07-14 | 몬테카를로 솔리테어 | 5x5 카드판에서 같은 숫자의 이웃한 두 장을 치우고 남은 카드를 당겨 채우며 모든 카드를 없애는 고전 카드 퍼즐입니다. |
| 2026-07-13 | 여우와 사냥개 | 여우를 대각선으로 움직여 사냥개 네 마리의 포위망을 빠져나가고, 사냥개는 아래쪽 대각선 이동으로 여우를 가두는 고전 추격 게임입니다. |
| 2026-07-12 | 왕실 우르 게임 | 네 개의 이진 주사위를 굴려 다섯 말을 전진시키고, 꽃무늬 칸의 추가 차례와 잡기를 활용해 먼저 모두 도착시키는 고대 경주 게임입니다. |

## 최근 게임 화면

### 라틴 사각형

![라틴 사각형 게임 화면](daily/2026-07-21-latin-square/screenshot.png)

### 마방진 15

![마방진 15 게임 화면](daily/2026-07-20-magic-square/screenshot.png)

### 카드 열 맞추기

![카드 열 맞추기 게임 화면](daily/2026-07-19-poker-squares/screenshot.png)

### 돼지 주사위

![돼지 주사위 게임 화면](daily/2026-07-18-pig-dice/screenshot.png)

### 시계 솔리테어

![시계 솔리테어 게임 화면](daily/2026-07-17-clock-solitaire/screenshot.png)

### 루도 미니

![루도 미니 게임 화면](daily/2026-07-16-mini-ludo/screenshot.png)

### 불가리아 솔리테어

![불가리아 솔리테어 게임 화면](daily/2026-07-15-bulgarian-solitaire/screenshot.png)

### 몬테카를로 솔리테어

![몬테카를로 솔리테어 게임 화면](daily/2026-07-14-monte-carlo-solitaire/screenshot.png)

### 여우와 사냥개

![여우와 사냥개 게임 화면](daily/2026-07-13-fox-and-hounds/screenshot.png)

### 왕실 우르 게임

![왕실 우르 게임 화면](daily/2026-07-12-royal-ur/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-07-21-latin-square/game-logic.test.js
node daily/2026-07-20-magic-square/game-logic.test.js
node daily/2026-07-19-poker-squares/game-logic.test.js
node daily/2026-07-18-pig-dice/game-logic.test.js
node daily/2026-07-17-clock-solitaire/game-logic.test.js
node daily/2026-07-16-mini-ludo/game-logic.test.js
node daily/2026-07-15-bulgarian-solitaire/game-logic.test.js
node daily/2026-07-14-monte-carlo-solitaire/game-logic.test.js
node daily/2026-07-13-fox-and-hounds/game-logic.test.js
node daily/2026-07-12-royal-ur/game-logic.test.js
```
