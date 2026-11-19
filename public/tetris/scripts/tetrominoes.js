export function getTetrominoes(width) {
  
  //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ],
  jTetromino = [
    [1, width+2, width*2+2, 2],
    [width+2, width*2, width*2+1, width*2+2],
    [1, width+1, width*2+1, width*2+2],
    [width, width+1, width+2, width*2],
  ],
  zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ],
  sTetromino = [
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2],
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2],
  ],
  tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ],
  oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ],
  iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ];

  // const theTetrominoes = [lTetromino, jTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino];

  return [
    lTetromino,
    jTetromino,
    zTetromino,
    sTetromino,
    tTetromino,
    oTetromino,
    iTetromino
  ];
}

export const colors = [
  '#2061b7',
  '#852dd2',
  '#f7801f',
  '#f53737',
  '#20b743',
  '#ffd727',
  '#f71fa4'
];

export function getUpNextTetrominoes(displayWidth) {
  
  //the Tetrominos without rotations
  return [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [1, displayWidth+2, displayWidth*2+2, 2], //jTetromino
    [1, displayWidth+1, displayWidth+2, displayWidth*2+2], //zTetromino
    [2,displayWidth+1,displayWidth+2,displayWidth*2+1], //sTetromino
    [displayWidth+1, displayWidth*2, displayWidth*2+1, displayWidth*2+2], //tTetromino
    [displayWidth+1, displayWidth+2, displayWidth*2+1, displayWidth*2+2], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]
};