import { colors } from './tetrominoes.js';

// Draw the Tetromino in the next position
export function draw(squares, current, currentPosition, random) {
  current.forEach((index) => {
    const square = squares[currentPosition + index];
    if (!square) return;
    square.classList.add('tetromino');
    square.style.backgroundColor = colors[random];
  });
}

// Undraw the Tetromino
export function undraw(squares, current, currentPosition) {
  current.forEach((index) => {
    const square = squares[currentPosition + index];
    if (!square || square.classList.contains('taken')) return;
    square.classList.remove('tetromino');
    square.style.backgroundColor = '';
  });
}

export function isValidPosition(squares, current, currentPosition) {
  return current.every((index) => {
    const position = currentPosition + index;
    return position >= 0 && position < squares.length && !squares[position].classList.contains('taken') && !squares[position].classList.contains('bottom-row');
  });
}

export function isOccupied(squares, position) {
  if (position < 0 || position >= squares.length) return true;
  return squares[position].classList.contains('taken') || squares[position].classList.contains('bottom-row');
}

export function isAtLeftEdge(current, currentPosition, width) {
  return current.some((index) => (currentPosition + index) % width === 0);
}

export function isAtRightEdge(current, currentPosition, width) {
  return current.some((index) => (currentPosition + index) % width === width - 1);
}
