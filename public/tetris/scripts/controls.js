import { undraw } from './board.js';
import { displayShape } from './ui.js';
import { CONFIG } from './config.js';

export function setupControls(game) {
  document.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.code)) {
      e.preventDefault();
    }

    if (game.gameFinished) return;

    switch (e.code) {
      case 'ArrowLeft':
        if (game.gameStarted) game.moveLeft();
        break;

      case 'ArrowRight':
        if (game.gameStarted) game.moveRight();
        break;

      case 'ArrowUp':
        if (game.gameStarted) game.rotate();
        break;

      case 'ArrowDown':
        if (game.gameStarted) startSoftDrop(game);
        break;

      case 'Space':
        game.startBtn.style.display = 'none';
        stopStart(game);
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
      stopSoftDrop(game);
    }
  });
}

export function stopStart(game) {
  //  pause
  if (game.timerId) {
    game.stopTimers();
    game.timerId = null;
    game.gamePaused = true;
    game.pauseModal.style.display = 'block';

    // resume/start
  } else {
    if (!game.gameStarted) {
      game.gameStarted = true;
      game.gameStartTime = Date.now();
    }
    undraw(game.squares, game.current, game.currentPosition);
    game.timerId = setInterval(() => game.moveDown(), game.speed);
    if (!game.gamePaused) {
      game.nextRandom = game.randomTetromino();
    }
    displayShape(game);
    game.gamePaused = false;
    game.pauseModal.style.display = 'none';
  }
}

function startSoftDrop(game) {
  if (game.downKeyHeld || game.gamePaused || !game.gameStarted) return;

  game.downKeyHeld = true;

  game.moveDown();

  game.softDropInterval = setInterval(() => {
    if (game.gameFinished || game.gamePaused) return;

    game.moveDown();
  }, CONFIG.SOFT_DROP_INTERVAL);
}

function stopSoftDrop(game) {
  game.downKeyHeld = false;

  clearInterval(game.softDropInterval);

  game.softDropInterval = null;
}
