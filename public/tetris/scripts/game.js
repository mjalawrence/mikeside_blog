// add this. to all variable and method calls in this file

import { getTetrominoes, getUpNextTetrominoes } from './tetrominoes.js';
import { draw, undraw, isValidPosition, isOccupied } from './board.js';
import { addScore } from './scoring.js';
import { prepareScore } from './leaderboard.js';
import { displayShape, showGameOver } from './ui.js';
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
    this.submitButton = document.getElementById('submit-score');

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

    // Next piece display
    this.displaySquares = document.querySelectorAll('.mini-grid div');
    this.displayWidth = 4;
    this.displayIndex = 0;

    this.upNextTetrominoes = getUpNextTetrominoes(this.displayWidth);
  }

  init() {
    displayShape(this);

    this.startBtn.addEventListener('click', () => {
      this.startBtn.style.display = 'none';
      stopStart(this);
    });

    this.playAgainBtn.addEventListener('click', () => {
      this.gameFinished = false;
      this.playAgain();
    });

    this.submitButton.addEventListener('click', async () => {
      // const playerName = document.getElementById('name').value.trim();
      // gameDuratQion = Math.floor((Date.now() - gameStartTime) / 1000);
      // console.log(`Game duration: ${gameDuration} seconds`);
      prepareScore(this);
    });
  }

  randomTetromino() {
    return Math.floor(Math.random() * this.theTetrominoes.length);
  }

  //move down function
  moveDown() {
    if (this.gamePaused || !this.gameStarted) {
      return;
    }
    undraw(this.squares, this.current, this.currentPosition);
    // Check whether moving down would collide with something
    if (this.current.some((index) => isOccupied(this.squares, this.currentPosition + index + this.width))) {
      draw(this.squares, this.current, this.currentPosition, this.random);
      this.freeze();
      return;
    }
    this.currentPosition += this.width;
    draw(this.squares, this.current, this.currentPosition, this.random);
    // freeze();
  }

  //freeze function
  freeze() {
    // new tet always starts in same position
    this.currentRotation = 0;

    if (this.current.some((index) => isOccupied(this.squares, this.currentPosition + index + this.width))) {
      this.current.forEach((index) => this.squares[this.currentPosition + index].classList.add('taken'));
      //start a new tetromino falling
      this.random = this.nextRandom;
      this.nextRandom = this.randomTetromino();
      this.current = this.theTetrominoes[this.random][this.currentRotation];
      this.currentPosition = 4;
      addScore(this);
      draw(this.squares, this.current, this.currentPosition, this.random);
      displayShape(this);
      this.gameOver();
    }
    console.log('speed', this.speed);
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  moveLeft() {
    if (this.gamePaused) {
      return;
    }
    undraw(this.squares, this.current, this.currentPosition);
    this.isAtLeftEdge = this.current.some((index) => (this.currentPosition + index) % this.width === 0);
    if (!this.isAtLeftEdge) this.currentPosition -= 1;
    if (this.current.some((index) => isOccupied(this.squares, this.currentPosition + index))) {
      this.currentPosition += 1;
    }
    draw(this.squares, this.current, this.currentPosition, this.random);
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  moveRight() {
    if (this.gamePaused) {
      return;
    }
    undraw(this.squares, this.current, this.currentPosition);
    this.isAtRightEdge = this.current.some((index) => (this.currentPosition + index) % this.width === this.width - 1);
    if (!this.isAtRightEdge) this.currentPosition += 1;
    if (this.current.some((index) => isOccupied(this.squares, this.currentPosition + index))) {
      this.currentPosition -= 1;
    }
    draw(this.squares, this.current, this.currentPosition, this.random);
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  isAtRight() {
    return this.current.some((index) => (this.currentPosition + index + 1) % this.width === 0);
  }

  isAtLeft() {
    return this.current.some((index) => (this.currentPosition + index) % this.width === 0);
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

  //rotate the tetromino

  rotate() {
    if (this.gamePaused) return;

    undraw(this.squares, this.current, this.currentPosition);

    this.previousRotation = this.currentRotation;
    this.previousPosition = this.currentPosition;

    this.currentRotation = (this.currentRotation + 1) % this.theTetrominoes[this.random].length;
    this.current = this.theTetrominoes[this.random][this.currentRotation];

    this.checkRotatedPosition();

    if (!isValidPosition(this.squares, this.current, this.currentPosition)) {
      this.currentRotation = this.previousRotation;
      this.currentPosition = this.previousPosition;
      this.current = this.theTetrominoes[this.random][this.currentRotation];
    }

    draw(this.squares, this.current, this.currentPosition, this.random);
  }

  // game over
  gameOver() {
    if (this.current.some((index) => isOccupied(this.squares, this.currentPosition + index))) {
      this.stopTimers();
      this.gameDuration = Math.floor((Date.now() - this.gameStartTime) / 1000);
      console.log(`Game duration: ${this.gameDuration} seconds`);
      this.nextRandom = 0;
      showGameOver(this);
      this.gameFinished = true;
    }
  }

  //play again
  playAgain() {
    this.squares.forEach((square) => {
      square.classList.remove('tetromino');
      square.classList.remove('taken');
      square.style.backgroundColor = '';
    });
    this.speed = CONFIG.INITIAL_SPEED;
    this.rowsCleared = 0;
    this.level = 0;
    this.gameStartTime = Date.now();
    // are both of these necessary? ***
    displayShape(this);
    this.nextRandom = 0;
    this.score = 0;
    this.gameOverModal.style.display = 'none';
    draw(this.squares, this.current, this.currentPosition, this.random);
    this.timerId = setInterval(() => this.moveDown(), this.speed);
    this.nextRandom = this.randomTetromino();
    // are both of these necessary? ***
    // displayShape(this);
  }

  stopTimers() {
    clearInterval(this.timerId);
    clearInterval(this.softDropInterval);

    this.timerId = null;
    this.softDropInterval = null;
  }
}
