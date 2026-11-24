import { CONFIG } from './config.js';
import { updateScoreDisplay } from './ui.js';

export function addScore(game) {
  for (let rowStart = 0; rowStart < game.BOARD_SIZE;) {
    const row = Array.from({ length: game.width }, (_, offset) => rowStart + offset);
    const isFullRow = row.every((index) => game.squares[index].classList.contains('taken') || game.squares[index].classList.contains('bottom-row'));

    if (!isFullRow) {
      rowStart += game.width;
      continue;
    }

    game.score += CONFIG.POINTS_PER_ROW;
    game.rowsCleared += 1;

    row.forEach((index) => {
      game.squares[index].classList.remove('taken', 'tetromino');
      game.squares[index].style.backgroundColor = '';
    });

    // Move the cleared row to the top, then re-check this row index.
    const removedRow = game.squares.splice(rowStart, game.width);
    game.squares = removedRow.concat(game.squares);
    // pushes the squares down
    game.squares.forEach((cell) => game.grid.appendChild(cell));

    updateScoreDisplay(game);
    levelUp(game);
  }
}

export function levelUp(game) {
  // Each level is 100 points.
  const targetLevel = Math.floor(game.score / CONFIG.POINTS_PER_LEVEL);
  while (game.level < targetLevel) {
    game.level += 1;
    increaseSpeed(game);
  }
}

export function increaseSpeed(game) {
  game.speed = Math.max(CONFIG.MIN_SPEED, game.speed - CONFIG.SPEED_INCREMENT);

  if (game.timerId !== null) {
    clearInterval(game.timerId);
    game.timerId = setInterval(() => game.moveDown(), game.speed);
  }
}
