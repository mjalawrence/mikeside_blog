import { colors } from './tetrominoes.js';
// Up next Shapes

//display the shape in the mini-grid display
export function displayShape(game) {
  //remove any trace of a tetromino form the entire grid
  game.displaySquares.forEach((square) => {
    square.classList.remove('tetromino');
    square.style.backgroundColor = '';
  });
  game.upNextTetrominoes[game.nextRandom].forEach((index) => {
    game.displaySquares[game.displayIndex + index].classList.add('tetromino');
    game.displaySquares[game.displayIndex + index].style.backgroundColor = colors[game.nextRandom];
  });
}

export function showGameOver(game) {
  game.gameOverModal.style.display = 'flex';
  game.pauseModal.style.display = 'none';
}
