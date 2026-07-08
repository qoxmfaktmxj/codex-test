# 데일리 클래식 게임

날짜별로 작은 클래식 브라우저 게임을 모아두는 저장소입니다. 각 게임은 새 의존성 없이 정적 HTML, CSS, JavaScript만 사용합니다.

이전 게임 설명과 화면은 [아카이브](archive/README-games.md)에 보관합니다.

## 최근 게임 목록

| 날짜 | 게임 | 설명 |
| --- | --- | --- |
| 2026-07-08 | 십오 퍼즐 | 빈칸 옆 숫자를 밀어 4x4 말판의 숫자를 1부터 15까지 차례대로 맞추는 고전 슬라이딩 퍼즐입니다. |
| 2026-07-07 | 하노이의 탑 | 작은 원반 위에 큰 원반을 올리지 않으며 세 기둥 사이에서 모든 원반을 오른쪽으로 옮기는 고전 퍼즐 게임입니다. |
| 2026-07-06 | 마스터마인드 | 여섯 가지 색으로 된 네 칸 암호를 추리하고, 정확한 위치와 색만 맞은 힌트로 정답을 좁히는 고전 추리 게임입니다. |
| 2026-07-05 | 에이스 듀스 | 펼쳐진 두 카드 사이에 다음 카드 숫자가 들어올지 배팅하며 목표 칩을 모으는 고전 카드 게임입니다. |
| 2026-07-04 | 301 다트 | 한 라운드에 세 번 던져 301점을 정확히 0점까지 줄이고, 마지막 점수는 더블 구역으로 끝내는 고전 펍 다트 게임입니다. |
| 2026-07-03 | 상자 닫기 | 두 주사위의 합과 같은 열린 숫자를 골라 닫고, 더 이상 조합이 없기 전에 모든 숫자를 없애는 고전 주사위 게임입니다. |
| 2026-07-02 | 독 초콜릿 피하기 | 고른 조각부터 오른쪽 아래가 모두 사라지는 초콜릿 판에서 독이 든 왼쪽 위 조각을 피하는 고전 전략 게임입니다. |
| 2026-07-01 | 전함 찾기 | 5x5 바다 격자에 숨은 세 척의 전함을 제한된 포탄 안에 모두 찾아 격침하는 고전 해전 추리 게임입니다. |
| 2026-06-30 | 불 끄기 | 칸을 누르면 십자 모양의 불이 함께 바뀌는 5x5 말판에서 모든 불을 끄는 고전 논리 퍼즐입니다. |
| 2026-06-29 | 서른하나 세기 | 1개부터 3개까지 숫자를 이어 부르며 31을 말하지 않도록 수를 조절하는 고전 숫자 게임입니다. |

## 최근 게임 화면

### 십오 퍼즐

![십오 퍼즐 게임 화면](daily/2026-07-08-fifteen-puzzle/screenshot.png)

### 하노이의 탑

![하노이의 탑 게임 화면](daily/2026-07-07-tower-of-hanoi/screenshot.png)

### 마스터마인드

![마스터마인드 게임 화면](daily/2026-07-06-mastermind/screenshot.png)

### 에이스 듀스

![에이스 듀스 게임 화면](daily/2026-07-05-acey-deucey/screenshot.png)

### 301 다트

![301 다트 게임 화면](daily/2026-07-04-darts-301/screenshot.png)

### 상자 닫기

![상자 닫기 게임 화면](daily/2026-07-03-shut-the-box/screenshot.png)

### 독 초콜릿 피하기

![독 초콜릿 피하기 게임 화면](daily/2026-07-02-chomp/screenshot.png)

### 전함 찾기

![전함 찾기 게임 화면](daily/2026-07-01-battleship/screenshot.png)

### 불 끄기

![불 끄기 게임 화면](daily/2026-06-30-lights-out/screenshot.png)

### 서른하나 세기

![서른하나 세기 게임 화면](daily/2026-06-29-count-to-31/screenshot.png)

## 테스트

로직 테스트는 Node.js 내장 모듈만 사용합니다.

```bash
node daily/2026-07-08-fifteen-puzzle/game-logic.test.js
node daily/2026-07-07-tower-of-hanoi/game-logic.test.js
node daily/2026-07-06-mastermind/game-logic.test.js
node daily/2026-07-05-acey-deucey/game-logic.test.js
node daily/2026-07-04-darts-301/game-logic.test.js
node daily/2026-07-03-shut-the-box/game-logic.test.js
node daily/2026-07-02-chomp/game-logic.test.js
node daily/2026-07-01-battleship/game-logic.test.js
node daily/2026-06-30-lights-out/game-logic.test.js
node daily/2026-06-29-count-to-31/game-logic.test.js
```
