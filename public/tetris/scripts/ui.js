import { colors } from './tetrominoes.js';

export function displayShape(game) {
  game.displaySquares.forEach((square) => {
    square.classList.remove('tetromino');
    square.style.backgroundColor = '';
  });

  const shape = game.upNextTetrominoes[game.nextRandom];
  if (!shape) return;

  shape.forEach((index) => {
    const square = game.displaySquares[game.displayIndex + index];
    if (!square) return;
    square.classList.add('tetromino');
    square.style.backgroundColor = colors[game.nextRandom];
  });
}

export function updateScoreDisplay(game) {
  if (game.scoreDisplay) game.scoreDisplay.textContent = String(game.score);
}

export function showGameOver(game) {
  if (game.gameOverModal) game.gameOverModal.style.display = 'flex';
  if (game.pauseModal) game.pauseModal.style.display = 'none';
}

export function showPause(game) {
  if (game.pauseModal) game.pauseModal.style.display = 'block';
}

export function hidePause(game) {
  if (game.pauseModal) game.pauseModal.style.display = 'none';
}

export function showStartButton(game) {
  if (game.startBtn) game.startBtn.style.display = '';
}

export function hideStartButton(game) {
  if (game.startBtn) game.startBtn.style.display = 'none';
}

export function hideGameOver(game) {
  if (game.gameOverModal) game.gameOverModal.style.display = 'none';
}
