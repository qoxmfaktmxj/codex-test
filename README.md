# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-07-01 | 전함 찾기 | 5x5 바다 격자에 숨은 세 척의 전함을 제한된 포탄 안에 모두 찾아 격침하는 고전 해전 추리 게임입니다. |
| 2026-06-30 | 불 끄기 | 칸을 누르면 십자 모양의 불이 함께 바뀌는 5x5 말판에서 모든 불을 끄는 고전 논리 퍼즐입니다. |
| 2026-06-29 | 서른하나 세기 | 1개부터 3개까지 숫자를 이어 부르며 31을 말하지 않도록 수를 조절하는 고전 숫자 게임입니다. |
| 2026-06-28 | 보석 맞추기 | 붙어 있는 보석 두 개를 바꿔 같은 색 보석 3개를 한 줄로 만들고 제한된 이동 안에 점수를 쌓는 고전 퍼즐입니다. |
| 2026-06-27 | 크랩스 주사위 | 두 주사위를 굴려 첫 굴림의 행운을 노리거나, 정해진 포인트를 7보다 먼저 다시 만드는 고전 주사위 게임입니다. |
| 2026-06-26 | 24 만들기 | 네 숫자를 한 번씩 쓰고 사칙연산을 조합해 정확히 24를 만드는 고전 숫자 퍼즐입니다. |
| 2026-06-25 | 강 건너기 | 농부가 작은 배로 늑대, 염소, 양배추를 모두 안전하게 오른쪽 강가로 옮기는 고전 퍼즐입니다. |
| 2026-06-24 | 여덟 퀸 | 체스 말판에 여덟 퀸을 놓아 서로 같은 가로, 세로, 대각선에서 공격하지 못하게 만드는 고전 퍼즐입니다. |
| 2026-06-23 | 기사 순회 | 체스 기사를 ㄱ자 모양으로 움직여 5x5 말판의 모든 칸을 한 번씩 방문하는 고전 퍼즐입니다. |
| 2026-06-22 | 같은 블록 지우기 | 붙어 있는 같은 색 블록 2개 이상을 골라 지우고 남은 블록을 아래와 왼쪽으로 모아 점수를 쌓는 퍼즐입니다. |

## 최근 게임 화면

### 전함 찾기

![전함 찾기 게임 화면](daily/2026-07-01-battleship/screenshot.png)

### 불 끄기

![불 끄기 게임 화면](daily/2026-06-30-lights-out/screenshot.png)

### 서른하나 세기

![서른하나 세기 게임 화면](daily/2026-06-29-count-to-31/screenshot.png)

### 보석 맞추기

![보석 맞추기 게임 화면](daily/2026-06-28-match-three/screenshot.png)

### 크랩스 주사위

![크랩스 주사위 게임 화면](daily/2026-06-27-craps-dice/screenshot.png)

### 24 만들기

![24 만들기 게임 화면](daily/2026-06-26-make-24/screenshot.png)

### 강 건너기

![강 건너기 게임 화면](daily/2026-06-25-river-crossing/screenshot.png)

### 여덟 퀸

![여덟 퀸 게임 화면](daily/2026-06-24-eight-queens/screenshot.png)

### 기사 순회

![기사 순회 게임 화면](daily/2026-06-23-knights-tour/screenshot.png)

### 같은 블록 지우기

![같은 블록 지우기 게임 화면](daily/2026-06-22-samegame/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-07-01-battleship/game-logic.test.js
node daily/2026-06-30-lights-out/game-logic.test.js
node daily/2026-06-29-count-to-31/game-logic.test.js
node daily/2026-06-28-match-three/game-logic.test.js
node daily/2026-06-27-craps-dice/game-logic.test.js
node daily/2026-06-26-make-24/game-logic.test.js
node daily/2026-06-25-river-crossing/game-logic.test.js
node daily/2026-06-24-eight-queens/game-logic.test.js
node daily/2026-06-23-knights-tour/game-logic.test.js
node daily/2026-06-22-samegame/game-logic.test.js
```
