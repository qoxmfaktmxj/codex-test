# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-09-02 | 요테 | 말을 가로·세로로 움직이거나 상대 말을 뛰어넘어 잡고, 상대 말 하나를 더 치워 먼저 모두 없애는 서아프리카의 고전 전략 게임입니다. |
| 2026-09-01 | 다라 | 말을 열두 개씩 놓은 뒤 가로·세로 이웃 칸으로 움직여 말 세 개를 한 줄로 만들고, 상대 말 열 개를 먼저 잡는 서아프리카의 고전 전략 게임입니다. |
| 2026-08-31 | 피카리아 | 세 말을 놓고 선으로 이어진 이웃 점으로 옮겨 가로·세로·대각선 한 줄을 먼저 만드는 북미 원주민의 고전 전략 게임입니다. |
| 2026-08-30 | 젓가락 게임 | 내 손가락 수를 상대 손에 더해 5가 되면 0으로 만들고, 손가락을 다시 나누며 상대의 두 손을 먼저 모두 0으로 만드는 고전 손놀이입니다. |
| 2026-08-29 | 여섯 남자 모리스 | 두 겹의 사각 말판에 여섯 개의 말을 놓고 가로·세로 한 줄을 만들어 상대 말을 없애거나 움직이지 못하게 하는 고전 전략 게임입니다. |
| 2026-08-28 | 다섯밭 코노 | 대각선으로 말 일곱 개를 한 칸씩 옮겨 상대편의 처음 자리 일곱 칸을 먼저 모두 채우는 한국의 고전 전략 게임입니다. |
| 2026-08-27 | 타플 | 수비군은 왕을 모서리로 탈출시키고, 공격군은 왕의 네 방향을 모두 둘러싸는 고대 북유럽 전략 게임입니다. |
| 2026-08-26 | 갭 솔리테어 | 줄의 맨 앞에는 2를, 그 뒤에는 같은 무늬의 다음 숫자를 이어 놓아 네 줄을 완성하는 고전 카드 퍼즐입니다. |
| 2026-08-25 | 미니 콰르토 | 상대가 고른 말을 4×4 말판에 놓고, 키·색·모양·구멍 중 하나가 같은 말 네 개를 가로·세로·대각선으로 먼저 만드는 고전 추상 전략 게임입니다. |
| 2026-08-24 | 미니 프리셀 | 두 개의 빈 칸을 활용해 색을 번갈아 한 단계 낮게 카드를 쌓고, 네 무늬를 A부터 4까지 기초 더미에 모으는 고전 카드 퍼즐입니다. |

## 최근 게임 화면

### 요테

![요테 게임 화면](daily/2026-09-02-yote/screenshot.png)

### 다라

![다라 게임 화면](daily/2026-09-01-dara/screenshot.png)

### 피카리아

![피카리아 게임 화면](daily/2026-08-31-picaria/screenshot.png)

### 젓가락 게임

![젓가락 게임 화면](daily/2026-08-30-chopsticks/screenshot.png)

### 여섯 남자 모리스

![여섯 남자 모리스 게임 화면](daily/2026-08-29-six-mens-morris/screenshot.png)

### 다섯밭 코노

![다섯밭 코노 게임 화면](daily/2026-08-28-five-field-kono/screenshot.png)

### 타플

![타플 게임 화면](daily/2026-08-27-tafl/screenshot.png)

### 갭 솔리테어

![갭 솔리테어 게임 화면](daily/2026-08-26-gaps-solitaire/screenshot.png)

### 미니 콰르토

![미니 콰르토 게임 화면](daily/2026-08-25-quarto/screenshot.png)

### 미니 프리셀

![미니 프리셀 게임 화면](daily/2026-08-24-mini-freecell/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-09-02-yote/game-logic.test.js
node daily/2026-09-01-dara/game-logic.test.js
node daily/2026-08-31-picaria/game-logic.test.js
node daily/2026-08-30-chopsticks/game-logic.test.js
node daily/2026-08-29-six-mens-morris/game-logic.test.js
node daily/2026-08-28-five-field-kono/game-logic.test.js
node daily/2026-08-27-tafl/game-logic.test.js
node daily/2026-08-26-gaps-solitaire/game-logic.test.js
node daily/2026-08-25-quarto/game-logic.test.js
node daily/2026-08-24-mini-freecell/game-logic.test.js
node daily/2026-08-23-dominoes/game-logic.test.js
node daily/2026-08-22-crazy-eights/game-logic.test.js
node daily/2026-08-21-klondike-solitaire/game-logic.test.js
node daily/2026-08-20-nonogram/game-logic.test.js
node daily/2026-08-19-aces-up-solitaire/game-logic.test.js
node daily/2026-08-18-peg-solitaire/game-logic.test.js
node daily/2026-08-17-teeko/game-logic.test.js
```
