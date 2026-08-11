# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-08-11 | 아코디언 솔리테어 | 같은 무늬 또는 숫자의 카드 위로 한 칸이나 세 칸 왼쪽 카드를 포개어, 모든 카드를 한 더미로 모으는 고전 카드 퍼즐입니다. |
| 2026-08-10 | 호랑이와 염소 | 염소 스무 마리로 호랑이 네 마리를 가두거나, 호랑이로 염소 다섯 마리를 뛰어넘어 잡는 네팔의 고전 포위 전략 게임입니다. |
| 2026-08-09 | 아홉 남자 모리스 | 말을 번갈아 놓고 움직여 가로 또는 세로 한 줄을 만든 뒤 상대 말을 잡아, 세 개 미만으로 줄이는 고전 보드 게임입니다. |
| 2026-08-08 | 심 | 여섯 점 사이의 선을 번갈아 자기 색으로 칠하고, 같은 색 삼각형을 먼저 만들지 않도록 피하는 고전 전략 게임입니다. |
| 2026-08-07 | 도미네어링 | 가로 도미노와 세로 도미노를 번갈아 빈칸에 놓고, 상대가 더 이상 놓을 자리가 없게 만드는 고전 전략 게임입니다. |
| 2026-08-06 | 마스터마인드 | 서로 다른 네 가지 색의 숨은 순서를 여덟 번 안에 맞히고, 자리와 색 힌트로 암호를 푸는 고전 추리 게임입니다. |
| 2026-08-05 | 러시 아워 | 자동차를 앞뒤로 움직여 길을 열고, 빨간 자동차를 오른쪽 탈출구로 보내는 고전 교통 퍼즐입니다. |
| 2026-08-04 | 코나네 | 검은 돌과 흰 돌을 번갈아 치운 뒤, 상대 말을 가로 또는 세로로 뛰어넘어 더 이상 움직이지 못하게 만드는 하와이 고전 전략 게임입니다. |
| 2026-08-03 | 헥스 | 파란 돌로 위와 아래를 연결하고, 상대가 빨간 돌로 왼쪽과 오른쪽을 잇기 전에 길을 완성하는 고전 연결 전략 게임입니다. |
| 2026-08-02 | 님 | 세 더미 중 하나에서 원하는 만큼 돌을 가져가 마지막 돌을 먼저 차지하는 고전 전략 게임입니다. |

## 최근 게임 화면

### 아코디언 솔리테어

![아코디언 솔리테어 게임 화면](daily/2026-08-11-accordion-solitaire/screenshot.png)

### 호랑이와 염소

![호랑이와 염소 게임 화면](daily/2026-08-10-tigers-and-goats/screenshot.png)

### 아홉 남자 모리스

![아홉 남자 모리스 게임 화면](daily/2026-08-09-nine-mens-morris/screenshot.png)

### 심

![심 게임 화면](daily/2026-08-08-sim/screenshot.png)

### 도미네어링

![도미네어링 게임 화면](daily/2026-08-07-domineering/screenshot.png)

### 마스터마인드

![마스터마인드 게임 화면](daily/2026-08-06-mastermind/screenshot.png)

### 러시 아워

![러시 아워 게임 화면](daily/2026-08-05-rush-hour/screenshot.png)

### 코나네

![코나네 게임 화면](daily/2026-08-04-konane/screenshot.png)

### 헥스

![헥스 게임 화면](daily/2026-08-03-hex/screenshot.png)

### 님

![님 게임 화면](daily/2026-08-02-nim/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-08-11-accordion-solitaire/game-logic.test.js
node daily/2026-08-10-tigers-and-goats/game-logic.test.js
node daily/2026-08-09-nine-mens-morris/game-logic.test.js
node daily/2026-08-08-sim/game-logic.test.js
node daily/2026-08-07-domineering/game-logic.test.js
node daily/2026-08-06-mastermind/game-logic.test.js
node daily/2026-08-05-rush-hour/game-logic.test.js
node daily/2026-08-04-konane/game-logic.test.js
node daily/2026-08-03-hex/game-logic.test.js
node daily/2026-08-02-nim/game-logic.test.js
```
