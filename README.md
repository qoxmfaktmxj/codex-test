# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-07-14 | 몬테카를로 솔리테어 | 5x5 카드판에서 같은 숫자의 이웃한 두 장을 치우고 남은 카드를 당겨 채우며 모든 카드를 없애는 고전 카드 퍼즐입니다. |
| 2026-07-13 | 여우와 사냥개 | 여우를 대각선으로 움직여 사냥개 네 마리의 포위망을 빠져나가고, 사냥개는 아래쪽 대각선 이동으로 여우를 가두는 고전 추격 게임입니다. |
| 2026-07-12 | 왕실 우르 게임 | 네 개의 이진 주사위를 굴려 다섯 말을 전진시키고, 꽃무늬 칸의 추가 차례와 잡기를 활용해 먼저 모두 도착시키는 고대 경주 게임입니다. |
| 2026-07-11 | 타파탄 | 세 개의 말을 3x3 교차점에 놓고 선을 따라 움직여 한 줄을 먼저 완성하는 고전 삼목 보드게임입니다. |
| 2026-07-10 | 헥사폰 | 세 개의 졸로 3x3 말판에서 전진과 대각선 잡기를 겨루며, 먼저 끝줄에 닿거나 상대를 막는 고전 미니 체스 게임입니다. |
| 2026-07-09 | 거위 게임 | 두 주사위를 굴려 특수 칸을 지나며 32번 칸에 정확히 도착해야 하는 고전 경주 보드게임입니다. |
| 2026-07-08 | 십오 퍼즐 | 빈칸 옆 숫자를 밀어 4x4 말판의 숫자를 1부터 15까지 차례대로 맞추는 고전 슬라이딩 퍼즐입니다. |
| 2026-07-07 | 하노이의 탑 | 작은 원반 위에 큰 원반을 올리지 않으며 세 기둥 사이에서 모든 원반을 오른쪽으로 옮기는 고전 퍼즐 게임입니다. |
| 2026-07-06 | 마스터마인드 | 여섯 가지 색으로 된 네 칸 암호를 추리하고, 정확한 위치와 색만 맞은 힌트로 정답을 좁히는 고전 추리 게임입니다. |
| 2026-07-05 | 에이스 듀스 | 펼쳐진 두 카드 사이에 다음 카드 숫자가 들어올지 배팅하며 목표 칩을 모으는 고전 카드 게임입니다. |

## 최근 게임 화면

### 몬테카를로 솔리테어

![몬테카를로 솔리테어 게임 화면](daily/2026-07-14-monte-carlo-solitaire/screenshot.png)

### 여우와 사냥개

![여우와 사냥개 게임 화면](daily/2026-07-13-fox-and-hounds/screenshot.png)

### 왕실 우르 게임

![왕실 우르 게임 화면](daily/2026-07-12-royal-ur/screenshot.png)

### 타파탄

![타파탄 게임 화면](daily/2026-07-11-tapatan/screenshot.png)

### 헥사폰

![헥사폰 게임 화면](daily/2026-07-10-hexapawn/screenshot.png)

### 거위 게임

![거위 게임 화면](daily/2026-07-09-game-of-goose/screenshot.png)

### 십오 퍼즐

![십오 퍼즐 게임 화면](daily/2026-07-08-fifteen-puzzle/screenshot.png)

### 하노이의 탑

![하노이의 탑 게임 화면](daily/2026-07-07-tower-of-hanoi/screenshot.png)

### 마스터마인드

![마스터마인드 게임 화면](daily/2026-07-06-mastermind/screenshot.png)

### 에이스 듀스

![에이스 듀스 게임 화면](daily/2026-07-05-acey-deucey/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-07-14-monte-carlo-solitaire/game-logic.test.js
node daily/2026-07-13-fox-and-hounds/game-logic.test.js
node daily/2026-07-12-royal-ur/game-logic.test.js
node daily/2026-07-11-tapatan/game-logic.test.js
node daily/2026-07-10-hexapawn/game-logic.test.js
node daily/2026-07-09-game-of-goose/game-logic.test.js
node daily/2026-07-08-fifteen-puzzle/game-logic.test.js
node daily/2026-07-07-tower-of-hanoi/game-logic.test.js
node daily/2026-07-06-mastermind/game-logic.test.js
node daily/2026-07-05-acey-deucey/game-logic.test.js
```
