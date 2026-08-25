(() => {
  const boardElement = document.querySelector('#board');
  const piecesElement = document.querySelector('#pieces');
  const message = document.querySelector('#message');
  const traitNames = { tall: ['낮은', '높은'], dark: ['밝은', '어두운'], square: ['둥근', '네모'], hollow: ['막힌', '뚫린'] };
  let state;
  let player;

  function pieceLabel(id) {
    const piece = Quarto.createPieces()[id];
    return Quarto.TRAITS.map((trait) => traitNames[trait][Number(piece.traits[trait])]).join(' · ');
  }

  function pieceNode(id, interactive) {
    const piece = Quarto.createPieces()[id];
    const element = document.createElement(interactive ? 'button' : 'span');
    if (interactive) element.type = 'button';
    element.className = `piece ${piece.traits.tall ? 'tall' : 'short'} ${piece.traits.dark ? 'dark' : 'light'} ${piece.traits.square ? 'square' : 'round'} ${piece.traits.hollow ? 'hollow' : 'solid'}`;
    element.setAttribute('aria-label', pieceLabel(id));
    element.title = pieceLabel(id);
    element.textContent = piece.traits.hollow ? '○' : '●';
    return element;
  }

  function winnerText(winner, winnerPlayer) {
    const trait = traitNames[winner.trait][Number(winner.value)];
    return `${trait} 특징의 말 네 개를 완성했습니다! ${winnerPlayer}의 승리입니다.`;
  }

  function choosePiece(id) {
    if (Quarto.getStatus(state) !== 'playing' || state.offeredPiece !== null) return;
    try {
      state = Quarto.offerPiece(state, id);
      message.textContent = `${player === '첫 번째 사람' ? '두 번째 사람' : '첫 번째 사람'}이(가) ${pieceLabel(id)} 말을 놓을 차례입니다.`;
      render();
    } catch (error) { message.textContent = error.message; }
  }

  function placeAt(row, column) {
    if (state.offeredPiece === null) {
      message.textContent = '먼저 상대에게 줄 말을 고르세요.';
      return;
    }
    try {
      const placer = player === '첫 번째 사람' ? '두 번째 사람' : '첫 번째 사람';
      state = Quarto.placePiece(state, row, column);
      const winner = Quarto.getWinner(state);
      if (winner) message.textContent = winnerText(winner, placer);
      else if (Quarto.getStatus(state) === 'draw') message.textContent = '말판이 모두 찼습니다. 이번 판은 비겼습니다.';
      else {
        player = player === '첫 번째 사람' ? '두 번째 사람' : '첫 번째 사람';
        message.textContent = `${player}이(가) 상대에게 줄 말을 고르세요.`;
      }
      render();
    } catch (error) { message.textContent = error.message; }
  }

  function render() {
    boardElement.replaceChildren(...state.board.flatMap((row, rowIndex) => row.map((id, columnIndex) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.setAttribute('aria-label', `${rowIndex + 1}행 ${columnIndex + 1}열${id === null ? ' 빈 칸' : ` ${pieceLabel(id)}`}`);
      if (id === null) cell.addEventListener('click', () => placeAt(rowIndex, columnIndex));
      else cell.append(pieceNode(id, false));
      return cell;
    })));
    piecesElement.replaceChildren(...state.available.map((id) => {
      const piece = pieceNode(id, state.offeredPiece === null && Quarto.getStatus(state) === 'playing');
      if (state.offeredPiece === null && Quarto.getStatus(state) === 'playing') piece.addEventListener('click', () => choosePiece(id));
      else if (id === state.offeredPiece) piece.classList.add('offered');
      return piece;
    }));
  }

  function startGame() {
    state = Quarto.createState();
    player = '첫 번째 사람';
    message.textContent = '첫 번째 사람이 상대에게 줄 말을 고르세요.';
    render();
  }
  document.querySelector('#reset').addEventListener('click', startGame);
  startGame();
})();
