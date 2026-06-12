# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-06-12 | 높낮이 카드 | 현재 카드보다 다음 카드가 높을지 낮을지 맞히며 연속 정답 기록에 도전하는 카드 게임입니다. |
| 2026-06-11 | 돼지 주사위 | 주사위를 굴려 점수를 쌓고 1이 나오기 전에 저장해 먼저 100점에 도달하는 게임입니다. |
| 2026-06-10 | 님 게임 | 한 더미에서 원하는 만큼 돌을 가져가며 마지막 돌을 가져가는 사람이 이기는 게임입니다. |
| 2026-06-09 | 마스터마인드 | 여섯 색 중 네 칸의 비밀 코드를 추리하고 위치와 색 힌트로 정답을 좁혀 가는 추리 게임입니다. |
| 2026-06-08 | 페그 솔리테어 | 말 하나를 건너 빈칸으로 뛰어넘으며 말을 제거하고 마지막 말 하나를 남기는 퍼즐 게임입니다. |
| 2026-06-07 | 달 착륙선 | 제한된 연료로 추력을 조절해 안전 속도로 달 표면에 내려앉는 고전 착륙 게임입니다. |
| 2026-06-06 | 하노이의 탑 | 작은 원반 위에 큰 원반을 올리지 않으며 모든 원반을 오른쪽 기둥으로 옮기는 퍼즐 게임입니다. |
| 2026-06-05 | 님 게임 | 돌을 1개부터 3개까지 가져가며 마지막 돌을 가져가기 위해 컴퓨터와 수 싸움을 하는 게임입니다. |
| 2026-06-01 | 소코반 창고 정리 | 상자를 밀어 모든 목표 칸 위에 올리는 창고 정리 퍼즐 게임입니다. |
| 2026-05-31 | 미로 탈출 | 열쇠를 찾아 출구 문을 열고 짧은 미로를 빠져나가는 퍼즐 게임입니다. |

## 최근 게임 화면

### 높낮이 카드

![높낮이 카드 게임 화면](daily/2026-06-12-high-low-card/screenshot.png)

### 돼지 주사위

![돼지 주사위 게임 화면](daily/2026-06-11-pig-dice/screenshot.png)

### 님 게임

![님 게임 화면](daily/2026-06-10-nim/screenshot.svg)

### 마스터마인드

![마스터마인드 게임 화면](daily/2026-06-09-mastermind/screenshot.png)

### 페그 솔리테어

![페그 솔리테어 게임 화면](daily/2026-06-08-peg-solitaire/screenshot.png)

### 달 착륙선

![달 착륙선 게임 화면](daily/2026-06-07-lunar-lander/screenshot.png)

### 하노이의 탑

![하노이의 탑 게임 화면](daily/2026-06-06-tower-of-hanoi/screenshot.png)

### 님 게임

![님 게임 화면](daily/2026-06-05-nim/screenshot.png)

### 소코반 창고 정리

![소코반 창고 정리 게임 화면](daily/2026-06-01-sokoban/screenshot.png)

### 미로 탈출

![미로 탈출 게임 화면](daily/2026-05-31-maze-escape/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-06-12-high-low-card/game-logic.test.js
node daily/2026-06-11-pig-dice/game-logic.test.js
node daily/2026-06-10-nim/game-logic.test.js
node daily/2026-06-09-mastermind/game-logic.test.js
node daily/2026-06-08-peg-solitaire/game-logic.test.js
node daily/2026-06-07-lunar-lander/game-logic.test.js
node daily/2026-06-06-tower-of-hanoi/game-logic.test.js
node daily/2026-06-05-nim/game-logic.test.js
node daily/2026-06-01-sokoban/game-logic.test.js
node daily/2026-05-31-maze-escape/game-logic.test.js
```
