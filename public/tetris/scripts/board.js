import { colors } from './tetrominoes.js';

// Draw the Tetromino in the next position
export function draw(squares, current, currentPosition, random) {
  current.forEach((index) => {
    const square = squares[currentPosition + index];
    square.classList.add('tetromino');
    square.style.backgroundColor = colors[random];
  });
}

// Undraw the Tetromino
export function undraw(squares, current, currentPosition) {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove('tetromino');
    squares[currentPosition + index].style.backgroundColor = '';
  });
}

// Check whether a position is valid
export function isValidPosition(squares, current, currentPosition) {
  return current.every((index) => {
    const position = currentPosition + index;

    return position >= 0 && position < squares.length && !squares[position].classList.contains('taken') && !squares[position].classList.contains('bottom-row');
  });
}

// export function isOccupied(squares, position) {
//   return (
//     squares[position].classList.contains('taken') ||
//     squares[position].classList.contains('bottom-row')
//   );
// }

// Check whether a square is occupied
export function isOccupied(squares, position) {
  return position < 0 || position >= squares.length || squares[position].classList.contains('taken') || squares[position].classList.contains('bottom-row');
}
