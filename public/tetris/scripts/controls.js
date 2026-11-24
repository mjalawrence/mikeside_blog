import { displayShape, hidePause, showPause, hideStartButton } from './ui.js';
import { draw } from './board.js';
import { CONFIG } from './config.js';

export function setupControls(game) {
  document.addEventListener('keydown', (event) => {
    if (['Space', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.code)) {
      event.preventDefault();
    }

    if (game.gameFinished) return;

    switch (event.code) {
      case 'ArrowLeft':
        if (game.gameStarted && !game.gamePaused) game.moveLeft();
        break;
      case 'ArrowRight':
        if (game.gameStarted && !game.gamePaused) game.moveRight();
        break;
      case 'ArrowUp':
        if (game.gameStarted && !game.gamePaused) game.rotate();
        break;
      case 'ArrowDown':
        if (game.gameStarted && !game.gamePaused) startSoftDrop(game);
        break;
      case 'Space':
        hideStartButton(game);
        stopStart(game);
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowDown') stopSoftDrop(game);
  });

  window.addEventListener('blur', () => stopSoftDrop(game));
}

export function stopStart(game) {
  if (game.gameFinished) return;

  if (game.timerId !== null) {
    game.stopTimers();
    game.gamePaused = true;
    stopSoftDrop(game);
    showPause(game);
    return;
  }

  if (!game.gameStarted) {
    game.gameStarted = true;
    game.gameStartTime = Date.now();
    game.nextRandom = game.randomTetromino();

    // Draw the first piece immediately
    draw(game.squares, game.current, game.currentPosition, game.random);
  }

  game.gamePaused = false;
  hidePause(game);
  displayShape(game);
  game.timerId = setInterval(() => game.moveDown(), game.speed);
}

function startSoftDrop(game) {
  if (game.downKeyHeld || game.gamePaused || !game.gameStarted || game.gameFinished) return;

  game.downKeyHeld = true;
  game.moveDown();

  game.softDropInterval = setInterval(() => {
    if (game.gameFinished || game.gamePaused) {
      stopSoftDrop(game);
      return;
    }
    game.moveDown();
  }, CONFIG.SOFT_DROP_INTERVAL);
}

export function stopSoftDrop(game) {
  game.downKeyHeld = false;
  if (game.softDropInterval !== null) clearInterval(game.softDropInterval);
  game.softDropInterval = null;
}
