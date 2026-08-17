# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-08-17 | 티코 | 5×5 말판에 빨간 말과 파란 말을 네 개씩 놓은 뒤 인접 칸으로 움직여, 가로·세로·대각선 네 칸 또는 2×2 네모를 먼저 만드는 고전 추상 전략 게임입니다. |
| 2026-08-16 | 브리지트 | 빨간 돌을 위아래로, 컴퓨터의 파란 돌을 왼쪽과 오른쪽으로 먼저 이어 승부하는 고전 연결 전략 게임입니다. |
| 2026-08-15 | 생명 게임 | 칸에 생명을 심고 이웃 수에 따라 다음 세대를 넘기며, 살아남고 태어나는 무늬를 관찰하는 고전 셀룰러 퍼즐입니다. |
| 2026-08-14 | 골프 솔리테어 | 버린 카드와 숫자가 하나 차이 나는 각 줄의 맨 위 카드만 이어 놓아, 일곱 줄을 모두 비우는 고전 카드 퍼즐입니다. |
| 2026-08-13 | 올드 메이드 | 컴퓨터의 뒷면 카드에서 한 장씩 뽑아 같은 숫자 짝을 버리고, 마지막 조커를 피하는 고전 카드 게임입니다. |
| 2026-08-12 | 피라미드 솔리테어 | 열린 카드 두 장의 합을 13으로 맞춰 제거하고, K 카드는 혼자 없애 피라미드를 비우는 고전 카드 퍼즐입니다. |
| 2026-08-11 | 아코디언 솔리테어 | 같은 무늬 또는 숫자의 카드 위로 한 칸이나 세 칸 왼쪽 카드를 포개어, 모든 카드를 한 더미로 모으는 고전 카드 퍼즐입니다. |
| 2026-08-10 | 호랑이와 염소 | 염소 스무 마리로 호랑이 네 마리를 가두거나, 호랑이로 염소 다섯 마리를 뛰어넘어 잡는 네팔의 고전 포위 전략 게임입니다. |
| 2026-08-09 | 아홉 남자 모리스 | 말을 번갈아 놓고 움직여 가로 또는 세로 한 줄을 만든 뒤 상대 말을 잡아, 세 개 미만으로 줄이는 고전 보드 게임입니다. |
| 2026-08-08 | 심 | 여섯 점 사이의 선을 번갈아 자기 색으로 칠하고, 같은 색 삼각형을 먼저 만들지 않도록 피하는 고전 전략 게임입니다. |

## 최근 게임 화면

### 티코

![티코 게임 화면](daily/2026-08-17-teeko/screenshot.png)

### 브리지트

![브리지트 게임 화면](daily/2026-08-16-bridgit/screenshot.png)

### 생명 게임

![생명 게임 화면](daily/2026-08-15-game-of-life/screenshot.png)

### 골프 솔리테어

![골프 솔리테어 게임 화면](daily/2026-08-14-golf-solitaire/screenshot.png)

### 올드 메이드

![올드 메이드 게임 화면](daily/2026-08-13-old-maid/screenshot.png)

### 피라미드 솔리테어

![피라미드 솔리테어 게임 화면](daily/2026-08-12-pyramid-solitaire/screenshot.png)

### 아코디언 솔리테어

![아코디언 솔리테어 게임 화면](daily/2026-08-11-accordion-solitaire/screenshot.png)

### 호랑이와 염소

![호랑이와 염소 게임 화면](daily/2026-08-10-tigers-and-goats/screenshot.png)

### 아홉 남자 모리스

![아홉 남자 모리스 게임 화면](daily/2026-08-09-nine-mens-morris/screenshot.png)

### 심

![심 게임 화면](daily/2026-08-08-sim/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-08-17-teeko/game-logic.test.js
node daily/2026-08-16-bridgit/game-logic.test.js
node daily/2026-08-15-game-of-life/game-logic.test.js
node daily/2026-08-14-golf-solitaire/game-logic.test.js
node daily/2026-08-13-old-maid/game-logic.test.js
node daily/2026-08-12-pyramid-solitaire/game-logic.test.js
node daily/2026-08-11-accordion-solitaire/game-logic.test.js
node daily/2026-08-10-tigers-and-goats/game-logic.test.js
node daily/2026-08-09-nine-mens-morris/game-logic.test.js
node daily/2026-08-08-sim/game-logic.test.js
```
