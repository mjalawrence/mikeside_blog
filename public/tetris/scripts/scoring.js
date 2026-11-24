import { CONFIG } from './config.js';

// Points awarded for clearing 1, 2, 3 or 4 rows simultaneously
const LINE_CLEAR_POINTS = [0, 100, 300, 500, 800];

export function addScore(game) {
  let linesCleared = 0;

  for (let i = 0; i < game.BOARD_SIZE;) {
    const row = Array.from({ length: game.width }, (_, index) => i + index);

    const isFullRow = row.every((index) => game.squares[index].classList.contains('taken') || game.squares[index].classList.contains('bottom-row'));

    if (isFullRow) {
      row.forEach((index) => {
        game.squares[index].classList.remove('taken', 'tetromino');
        game.squares[index].style.backgroundColor = '';
      });

      const squaresRemoved = game.squares.splice(i, game.width);
      game.squares = squaresRemoved.concat(game.squares);

      game.squares.forEach((cell) => game.grid.appendChild(cell));

      linesCleared++;
    } else {
      i += game.width;
    }
  }

  if (linesCleared === 0) return;

  // Award points based on the number of rows cleared at once
  const points = LINE_CLEAR_POINTS[linesCleared] || 0;

  game.score += points * (game.level + 1);
  game.rowsCleared += linesCleared;

  game.scoreDisplay.textContent = game.score;

  // Level progression is based on total rows cleared, not score
  levelUp(game);
}

export function levelUp(game) {
  const newLevel = Math.floor(game.rowsCleared / CONFIG.ROWS_PER_LEVEL);

  if (newLevel > game.level) {
    const levelsGained = newLevel - game.level;

    game.level = newLevel;

    // Increase speed for each level gained
    game.speed = Math.max(CONFIG.MIN_SPEED, game.speed - CONFIG.SPEED_INCREMENT * levelsGained);

    // Restart gravity timer at the new speed
    if (game.timerId !== null) {
      clearInterval(game.timerId);
      game.timerId = setInterval(() => game.moveDown(), game.speed);
    }
  }

  if (game.levelDisplay) {
    game.levelDisplay.textContent = game.level;
  }
}
