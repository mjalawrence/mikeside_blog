import { CONFIG } from './config.js';

export function addScore(game) {
  for (let i = 0; i < game.BOARD_SIZE;) {
    const row = Array.from({ length: game.width }, (_, index) => i + index);

    const isFullRow = row.every((index) => game.squares[index].classList.contains('taken') || game.squares[index].classList.contains('bottom-row'));

    if (isFullRow) {
      game.score += 10;
      game.rowsCleared += 1;

      game.scoreDisplay.textContent = game.score;

      row.forEach((index) => {
        game.squares[index].classList.remove('taken', 'tetromino');
        game.squares[index].style.backgroundColor = '';
      });

      // removes the cleared squares and adds them to the top
      const squaresRemoved = game.squares.splice(i, game.width);
      game.squares = squaresRemoved.concat(game.squares);
      // pushes the squares down
      game.squares.forEach((cell) => game.grid.appendChild(cell));

      levelUp(game);

      // Don't increment i: check the row that moved into this position.
    } else {
      i += game.width;
    }
  }
}

export function levelUp(game) {
  // Each level requires another 100 points.
  while (game.score >= (game.level + 1) * CONFIG.POINTS_PER_LEVEL) {
    game.level += 1;
    increaseSpeed(game);
  }
}

export function increaseSpeed(game) {
  // game.speed -= CONFIG.SPEED_INCREMENT;
  game.speed = Math.max(CONFIG.MIN_SPEED, game.speed - CONFIG.SPEED_INCREMENT);

  clearInterval(game.timerId);

  game.timerId = setInterval(() => game.moveDown(), game.speed);
}

// export function addScore(BOARD_SIZE, width, squares) {
//   for (let i = 0; i < BOARD_SIZE; i += width) {
//     const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

//     if (row.every((index) => squares[index].classList.contains('taken')) || row.every((index) => squares[index].classList.contains('bottom-row'))) {
//       this.isOccupied;
//       score += 10;
//       rowsCleared += 1;
//       scoreDisplay.textContent = score;
//       row.forEach((index) => {
//         squares[index].classList.remove('taken');
//         squares[index].classList.remove('tetromino');
//         squares[index].style.backgroundColor = '';
//       });

//       const squaresRemoved = squares.splice(i, width);
//       squares = squaresRemoved.concat(squares); // removes the cleared squares and adds them to the top
//       squares.forEach((cell) => grid.appendChild(cell)); // pushes the squares down
//       this.levelUp();
//     }
//   }
// }

// export function levelUp() {
//   // Check if next level reached (each level is 100 points)
//   const scoreRaw = this.score / CONFIG.POINTS_PER_LEVEL;
//   if (scoreRaw % 1 === 0) {
//     level += 1;
//     increaseSpeed();
//   }
// }

// export function increaseSpeed() {
//   speed -= CONFIG.SPEED_INCREMENT;
//   clearInterval(this.timerId);
//   timerId = setInterval(this.moveDown, this.speed);
// }
