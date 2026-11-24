import { getTetrominoes, getUpNextTetrominoes } from './tetrominoes.js';
import { draw, undraw, isValidPosition, isOccupied, isAtLeftEdge, isAtRightEdge } from './board.js';
import { addScore } from './scoring.js';
import { prepareScore } from './leaderboard.js';
import { displayShape, hideGameOver, hidePause, showGameOver, updateScoreDisplay } from './ui.js';
import { stopStart } from './controls.js';
import { CONFIG } from './config.js';

export class Game {
  constructor() {
    // Board
    this.grid = document.querySelector('.grid');
    this.squares = Array.from(document.querySelectorAll('.grid div'));
    this.width = CONFIG.BOARD_WIDTH;
    this.height = CONFIG.BOARD_HEIGHT;
    this.BOARD_SIZE = this.width * this.height;

    // UI elements
    this.scoreDisplay = document.querySelector('#score');
    this.startBtn = document.querySelector('#start-button');
    this.gameOverModal = document.querySelector('#game-over');
    this.pauseModal = document.querySelector('#pause');
    this.playAgainBtn = document.querySelector('#restart-button');
    this.submitButton = document.querySelector('#submit-score');

    // Next Tet display
    this.displaySquares = Array.from(document.querySelectorAll('.mini-grid div'));
    this.displayWidth = 4;
    this.displayIndex = 0;
    this.upNextTetrominoes = getUpNextTetrominoes(this.displayWidth);

    // Game state
    this.gameStarted = false;
    this.gamePaused = false;
    this.gameFinished = false;

    // Scoring
    this.score = 0;
    this.level = 0;
    this.speed = CONFIG.INITIAL_SPEED;
    this.rowsCleared = 0;

    // Timing
    this.timerId = null;
    this.softDropInterval = null;
    this.downKeyHeld = false;
    this.gameStartTime = null;
    this.gameDuration = null;

    // Tetrominoes
    this.theTetrominoes = getTetrominoes(this.width);
    this.currentPosition = 4;
    this.currentRotation = 0;
    this.random = this.randomTetromino();
    this.nextRandom = 0;
    this.current = this.theTetrominoes[this.random][this.currentRotation];

    // Supabase
    this.scoreSubmitting = false;
    this.scoreSubmitted = false;
  }

  init() {
    displayShape(this);

    this.startBtn?.addEventListener('click', () => {
      this.startBtn.style.display = 'none';
      stopStart(this);
    });

    this.playAgainBtn?.addEventListener('click', () => this.playAgain());

    this.submitButton?.addEventListener('click', async () => {
      if (this.scoreSubmitting || this.scoreSubmitted) return;

      this.scoreSubmitting = true;
      this.submitButton.disabled = true;

      try {
        const success = await prepareScore(this);

        if (success) {
          this.scoreSubmitted = true;
        } else {
          console.warn('Score was not submitted.');
        }
      } finally {
        this.scoreSubmitting = false;
        this.submitButton.disabled = this.scoreSubmitted;
      }
    });
  }

  randomTetromino() {
    return Math.floor(Math.random() * this.theTetrominoes.length);
  }

  moveDown() {
    if (this.gamePaused || !this.gameStarted || this.gameFinished) return;

    undraw(this.squares, this.current, this.currentPosition);
    // Check whether moving down would collide with something
    if (this.current.some((index) => isOccupied(this.squares, this.currentPosition + index + this.width))) {
      draw(this.squares, this.current, this.currentPosition, this.random);
      this.freeze();
      return;
    }

    this.currentPosition += this.width;
    draw(this.squares, this.current, this.currentPosition, this.random);
  }

  freeze() {
    if (!this.current.some((index) => isOccupied(this.squares, this.currentPosition + index + this.width))) return;

    this.current.forEach((index) => {
      this.squares[this.currentPosition + index].classList.add('taken');
    });

    // new tet always starts in same position
    this.currentRotation = 0;
    this.random = this.nextRandom;
    this.nextRandom = this.randomTetromino();
    this.current = this.theTetrominoes[this.random][this.currentRotation];
    this.currentPosition = 4;

    addScore(this);
    draw(this.squares, this.current, this.currentPosition, this.random);
    displayShape(this);
    this.gameOver();
    console.log('speed', this.speed);
  }

  moveLeft() {
    if (this.gamePaused || this.gameFinished) return;

    undraw(this.squares, this.current, this.currentPosition);
    if (!isAtLeftEdge(this.current, this.currentPosition, this.width)) {
      this.currentPosition -= 1;
    }
    if (this.current.some((index) => isOccupied(this.squares, this.currentPosition + index))) {
      this.currentPosition += 1;
    }
    draw(this.squares, this.current, this.currentPosition, this.random);
  }

  moveRight() {
    if (this.gamePaused || this.gameFinished) return;

    undraw(this.squares, this.current, this.currentPosition);
    if (!isAtRightEdge(this.current, this.currentPosition, this.width)) {
      this.currentPosition += 1;
    }
    if (this.current.some((index) => isOccupied(this.squares, this.currentPosition + index))) {
      this.currentPosition -= 1;
    }
    draw(this.squares, this.current, this.currentPosition, this.random);
  }

  checkRotatedPosition(P) {
    P = P || this.currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % this.width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (this.isAtRight()) {
        //use actual position to check if it's flipped over to right side
        this.currentPosition += 1; //if so, add one to wrap it back around
        this.checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % this.width > 5) {
      if (this.isAtLeft()) {
        this.currentPosition -= 1;
        this.checkRotatedPosition(P);
      }
    }
  }

  isAtRight() {
    return isAtRightEdge(this.current, this.currentPosition, this.width);
  }

  isAtLeft() {
    return isAtLeftEdge(this.current, this.currentPosition, this.width);
  }

  rotate() {
    if (this.gamePaused || this.gameFinished) return;

    undraw(this.squares, this.current, this.currentPosition);
    const previousRotation = this.currentRotation;
    const previousPosition = this.currentPosition;

    this.currentRotation = (this.currentRotation + 1) % this.theTetrominoes[this.random].length;
    this.current = this.theTetrominoes[this.random][this.currentRotation];
    this.checkRotatedPosition();

    if (!isValidPosition(this.squares, this.current, this.currentPosition)) {
      this.currentRotation = previousRotation;
      this.currentPosition = previousPosition;
      this.current = this.theTetrominoes[this.random][this.currentRotation];
    }

    draw(this.squares, this.current, this.currentPosition, this.random);
  }

  gameOver() {
    if (!this.current.some((index) => isOccupied(this.squares, this.currentPosition + index))) return;

    this.stopTimers();
    this.gameDuration = Math.floor((Date.now() - this.gameStartTime) / 1000);
    console.log(`Game duration: ${this.gameDuration} seconds`);
    this.nextRandom = 0;
    this.gameFinished = true;
    this.gamePaused = false;
    showGameOver(this);
  }

  playAgain() {
    this.stopTimers();
    this.squares.forEach((square) => {
      square.classList.remove('tetromino', 'taken');
      square.style.backgroundColor = '';
    });

    this.score = 0;
    this.level = 0;
    this.rowsCleared = 0;
    this.speed = CONFIG.INITIAL_SPEED;
    this.gameStarted = true;
    this.gamePaused = false;
    this.gameFinished = false;
    this.gameStartTime = Date.now();
    this.gameDuration = null;

    this.currentRotation = 0;
    this.currentPosition = 4;
    this.random = this.randomTetromino();
    this.nextRandom = this.randomTetromino();
    this.current = this.theTetrominoes[this.random][this.currentRotation];

    updateScoreDisplay(this);
    hideGameOver(this);
    hidePause(this);
    displayShape(this);
    draw(this.squares, this.current, this.currentPosition, this.random);

    this.timerId = setInterval(() => this.moveDown(), this.speed);
  }

  stopTimers() {
    if (this.timerId !== null) clearInterval(this.timerId);
    if (this.softDropInterval !== null) clearInterval(this.softDropInterval);
    this.timerId = null;
    this.softDropInterval = null;
    this.downKeyHeld = false;
  }
}
