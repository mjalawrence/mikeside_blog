import { Game } from './game.js';
import { setupControls } from './controls.js';

document.addEventListener('DOMContentLoaded', () => {

  const game = new Game();

  game.init();

  setupControls(game);

});    



// import { getTetrominoes, colors, getUpNextTetrominoes } from './tetrominoes.js';
// import { CONFIG } from './config.js'

// document.addEventListener('DOMContentLoaded', () => {

//   const grid = document.querySelector('.grid');
//   let squares = Array.from(document.querySelectorAll('.grid div'));
//   const scoreDisplay = document.querySelector('#score');
//   // const pauseBtn = document.querySelector('#pause-button');
//   const startBtn = document.querySelector('#start-button');
//   let gameOverModal = document.querySelector("#game-over");
//   let pauseModal = document.querySelector("#pause");
//   const playAgainBtn = document.querySelector('#restart-button');
//   const width = CONFIG.BOARD_WIDTH;
//   const height = CONFIG.BOARD_HEIGHT
//   const START_POSITION = 4;
//   const BOARD_SIZE = width * height;
//   let nextRandom = 0;

//   let gameStarted = false;
//   let gamePaused = false;
//   let gameFinished = false;

//   let timerId;
//   let score = 0;
//   let level = 0;
//   let speed = CONFIG.INITIAL_SPEED;
//   let rowsCleared = 0;
//   let gameStartTime;
//   let gameDuration;

//   const theTetrominoes = getTetrominoes(width)

//   let currentPosition = START_POSITION;
//   let currentRotation = 0;

//   //randomly select a Tetromino and its first rotation
//   let random = Math.floor(superRandom()*theTetrominoes.length);
//   let current = theTetrominoes[random][currentRotation];

//   let downKeyHeld = false;
//   let softDropInterval;

//   //draw the Tetromino
//   function draw() {
//     current.forEach(index => {
//       squares[currentPosition + index].classList.add('tetromino');
//       squares[currentPosition + index].style.backgroundColor = colors[random];
//     })
//   }

//   //undraw the Tetromino
//   function undraw() {
//     current.forEach(index => {
//       squares[currentPosition + index].classList.remove('tetromino');
//       squares[currentPosition + index].style.backgroundColor = '';
//     })
//   }


//   //assign functions to keyCodes
//   function control(e) {
//     if (gameFinished || (!gameStarted && e.code !== 'Space')) return
//     if(e.keyCode === 37) {
//       moveLeft();
//     } else if (e.keyCode === 38) {
//       rotate();
//     } else if (e.keyCode === 39) {
//       moveRight();
//     } else if (e.keyCode === 40) {
//       if (!downKeyHeld) {
//         downKeyHeld = true;
//         moveDown(); 
//         // Move immediately on press
//         softDropInterval = setInterval(() => {
//           if (gameFinished) return
//           moveDown(); 
//           // Continue while held        
//         }, CONFIG.SOFT_DROP_INTERVAL);
//       }
//       // return;    
//     } else if (e.code === 'Space') {
//       startBtn.style.display = 'none';
//       stopStart()
//     }         
//       // e.preventDefault();  
//     }
//  // document.addEventListener('keyup', control, false)

// // can this integrate with control(e)
//   function stopSoftDrop(e) {
//     if (e.keyCode === 40) {
//       downKeyHeld = false;
//       clearInterval(softDropInterval);
//     }}
//   document.addEventListener('keydown', control);
//   document.addEventListener('keyup', stopSoftDrop, false);


//   //move down function
//   function moveDown() {
//     if (gamePaused || !gameStarted) {
//       return;
//     }
//     undraw();
//      // Check whether moving down would collide with something
//     if(current.some(index => isOccupied(currentPosition + index + width))) {
//       draw();
//       freeze();
//       return;
//     }
//     currentPosition += width;
//     draw();
//     // freeze();
//   }

//   //freeze function
//   function freeze() {
    
//     // new tet always starts in same position
//     currentRotation = 0;

//     if(current.some(index => isOccupied(currentPosition + index + width))) {
//       current.forEach(index => squares[currentPosition + index].classList.add('taken'));
//       //start a new tetromino falling
//       random = nextRandom;
//       nextRandom = Math.floor(superRandom() * theTetrominoes.length);
//       current = theTetrominoes[random][currentRotation];
//       currentPosition = 4;
//       addScore();
//       draw();
//       displayShape();
//       gameOver();
//     }
//     console.log('speed', speed)
//   }

//   //move the tetromino left, unless is at the edge or there is a blockage
//   function moveLeft() {
//     if (gamePaused) {
//       return;
//     }
//     undraw()
//     const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
//     if(!isAtLeftEdge) currentPosition -=1
//     if(current.some(index => isOccupied(currentPosition + index))) {
//       currentPosition += 1;
//     }
//     draw()
//   }

//   //move the tetromino right, unless is at the edge or there is a blockage
//   function moveRight() {
//     if (gamePaused) {
//       return;
//     }
//     undraw()
//     const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
//     if(!isAtRightEdge) currentPosition += 1;
//     if(current.some(index => isOccupied(currentPosition + index))) {
//       currentPosition -=1
//     }
//     draw()
//   }

  
//   ///FIX ROTATION OF TETROMINOS A THE EDGE 
//   function isAtRight() {
//     return current.some(index=> (currentPosition + index + 1) % width === 0)  
//   }
  
//   function isAtLeft() {
//     return current.some(index=> (currentPosition + index) % width === 0)
//   }
  
//   function checkRotatedPosition(P){
//     P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
//     if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
//       if (isAtRight()){            //use actual position to check if it's flipped over to right side
//         currentPosition += 1;    //if so, add one to wrap it back around
//         checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
//         }
//     }
//     else if (P % width > 5) {
//       if (isAtLeft()){
//         currentPosition -= 1;
//       checkRotatedPosition(P)
//       }
//     }
//   }
 
//   function isValidPosition() {
//     return current.every(index => {
//       const position = currentPosition + index;

//       return (
//         position >= 0 &&
//         position < squares.length &&
//         !squares[position].classList.contains('taken') &&
//         !squares[position].classList.contains('bottom-row')
//       );
//     });
//   }

//   function isOccupied(position) {
//     return (
//       squares[position].classList.contains('taken') ||
//       squares[position].classList.contains('bottom-row')
//     );
//   }

//   function stopTimers() {
//     clearInterval(timerId);
//     clearInterval(softDropInterval);

//     timerId = null;
//     softDropInterval = null;
//   }


//   //rotate the tetromino
  
//   function rotate() {
//     if (gamePaused) return;

//     undraw();

//     const previousRotation = currentRotation;
//     const previousPosition = currentPosition;

//     currentRotation = (currentRotation + 1) % theTetrominoes[random].length;
//     current = theTetrominoes[random][currentRotation];

//     checkRotatedPosition();

//     if (!isValidPosition()) {
//       currentRotation = previousRotation;
//       currentPosition = previousPosition;
//       current = theTetrominoes[random][currentRotation];
//     }

//     draw();
//   }

//   // Up next Shapes

//   //show up-next tetromino in mini-grid display
//   const displaySquares = document.querySelectorAll('.mini-grid div');
//   const displayWidth = 4;
//   const displayIndex = 0;

//   // //the Tetrominos without rotations
//   const upNextTetrominoes = getUpNextTetrominoes(displayWidth);

//   //display the shape in the mini-grid display
//   function displayShape() {
//     //remove any trace of a tetromino form the entire grid
//     displaySquares.forEach(square => {
//       square.classList.remove('tetromino')
//       square.style.backgroundColor = ''
//     })
//     upNextTetrominoes[nextRandom].forEach( index => {
//       displaySquares[displayIndex + index].classList.add('tetromino')
//       displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
//     })
//   }

//   // Extra game controls 
  
//   //add functionality to the button
//   // pauseBtn.addEventListener('click', () => {
//   //   stopStart()
//   // })

//   startBtn.addEventListener('click', () => {
//     startBtn.style.display = 'none';
//     stopStart()
//   })

//   function stopStart() {
//     //  pause    
//     if (timerId) {
//       stopTimers();
//       timerId = null
//       gamePaused = true;
//       pauseModal.style.display = 'block';
      
//       // resume/start    
//     } else {
//       if (!gameStarted) {
//         gameStarted = true;    
//         gameStartTime = Date.now();
//       }
//       draw()
//       timerId = setInterval(moveDown, speed)
//       if (!gamePaused) {
//         nextRandom = Math.floor(superRandom()*theTetrominoes.length)
//       }
//       displayShape()
//       gamePaused = false;
//       pauseModal.style.display = 'none';
//     }
//   }

//   playAgainBtn.addEventListener('click', () => {

//     gameFinished = false;
//     playAgain()
//   })

//   //add score
//   function addScore() {
//     for (let i = 0; i < BOARD_SIZE; i += width) {
//       const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

//       if(row.every(index => squares[index].classList.contains('taken')) || row.every(index => squares[index].classList.contains('bottom-row'))) {
//         isOccupied
//         score += 10;
//         rowsCleared += 1;
//         scoreDisplay.textContent = score
//         row.forEach(index => {
//           squares[index].classList.remove('taken')
//           squares[index].classList.remove('tetromino')
//           squares[index].style.backgroundColor = ''
//         })
//         const squaresRemoved = squares.splice(i, width)
//         squares = squaresRemoved.concat(squares) // removes the cleared squares and adds them to the top
//         squares.forEach(cell => grid.appendChild(cell)) // pushes the squares down 
//         levelUp()
//       }
//     }
//     console.log('rowsCleared', rowsCleared)
//   }

//   function levelUp() {
//     // Check if next level reached (each level is 100 points)
//     const scoreRaw = score / CONFIG.POINTS_PER_LEVEL;
//     if (scoreRaw % 1 === 0) {
//       level += 1;
//       increaseSpeed();
//     }
//   }

//   function increaseSpeed() {
//     speed -= CONFIG.SPEED_INCREMENT;
//     clearInterval(timerId);
//     timerId = setInterval(moveDown, speed);
//   }

//   //game over
//   function gameOver() {
//     if(current.some(index => isOccupied(currentPosition + index))) {
//       stopTimers();
//       gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
//       console.log(`Game duration: ${gameDuration} seconds`);
//       nextRandom = 0
//       gameOverModal.style.display = 'flex';
//       pauseModal.style.display = 'none';
//       gameFinished = true;
//     }
//   }

//   const submitButton = document.getElementById('submit-score');

//   submitButton.addEventListener('click', async () => {
//     const playerName = 'mike'
//     // // const playerName = document.getElementById('name').value.trim();
//     // const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);

//     console.log(`Game duration: ${gameDuration} seconds`);
//     const results = {
//       player_name: playerName,
//       score: score,
//       level: level,
//       top_speed: speed,
//       rows_cleared: rowsCleared,
//       duration: gameDuration
//     }

//     const success = await window.submitScore(results)

//     if (success) {
//       await window.displayLeaderboard();
//       console.log('boosh')
//     }
//   });


//   //play again
//   function playAgain() {
//     squares.forEach(square => {
//       square.classList.remove('tetromino')
//       square.classList.remove('taken')
//       square.style.backgroundColor = '';
//     })
//     speed = CONFIG.INITIAL_SPEED;
//     rowsCleared = 0;
//     level = 0;
//         gameStartTime = Date.now();
//     displayShape();
//     nextRandom = 0;
//     score = 0;
//     gameOverModal.style.display = 'none';
//     draw();
//     timerId = setInterval(moveDown, speed);
//     nextRandom = Math.floor(superRandom()*theTetrominoes.length);
//     displayShape();
//   }
    
//   function superRandom() {
//     return Math.random();
//   }
// })

// // Disable scroll when playing tetris
// window.addEventListener("keydown", function(e) {
//   if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1){
//     e.preventDefault();
//   }
// }, false);