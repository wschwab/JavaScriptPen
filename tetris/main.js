//Based on a Derek Banas YouTube tutorial

let canvas;
let ctx;
let gameBoardArrayHeight = 20;
let gameBoardArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;

let coordinateArray = [...Array(gameBoardArrayHeight)].map(e => Array(gameBoardArrayWidth).fill(0));
let currentTetromino = [[1,0],[0,1],[1,1],[2,1]];

let tetrominos = [];
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
let currentTetrominoColor;

let gameBoardArray = [...Array(gameBoardArrayHeight)].map(e => Array(gameBoardArrayWidth).fill(0));
let stoppedArray = [...Array(gameBoardArrayHeight)].map(e => Array(gameBoardArrayWidth).fill(0));

let DIRECTION = {
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

let direction;


class Coordinates {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordArray() {
  let i = 0, j = 0;
  for (let y = 9; y <= 446; y+= 23) {
    for (let x = 11; x <= 264; x+= 23) {
      coordinateArray[i][j] = new Coordinates(x,y);
      i++;
    }
    j++;
    i = 0;
  }
}

function SetupCanvas() {
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 936;
  canvas.height = 956;

  ctx.scale(2,2);

  ctx.fillStyle = 'white';
  ctx.fillRect(0,0, canvas.width, canvas.height);

  ctx.strokeStyle = 'black';
  ctx.strokeRect(8,8,280,462);

  tetrisLogo = new Image(161,54);
  tetrisLogo.onLoad = DrawTetrisLogo;
  tetrisLogo.src = "tetrislogo.png";

  ctx.fillStyle = 'black';
  ctx.font = '21px Arial';
  ctx.fillText("SCORE", 300, 98);

  //Score
  ctx.strokeRect(300,107,161,24);
  ctx.fillText(score.toString(), 310, 157);
  //Level
  ctx.fillText("LEVEL", 300, 157);
  ctx.strokeRect(300,171,161,24);
  ctx.fillText(level.toString(), 310, 190);
  //Win-Lose
  ctx.fillText("WIN / LOSE", 300, 221);
  ctx.fillText(winOrLose, 310, 261);
  //Playing conditions
  ctx.strokeRect(300,232,161,95);
  //Controls
  ctx.fillText("CONTROLS", 300, 354);
  ctx.strokeRect(300,366,161,104);
  ctx.font = '19px Arial';
  ctx.fillText("A : Move Left", 310,388);
  ctx.fillText("D : Move Right", 310,413);
  ctx.fillText("S : Move Down", 310,354);
  ctx.fillText("E : Rotate", 310,463);

  document.addEventListener('keydown', HandleKeyPress);

  CreateTetrominos();
  CreateTetromino();

  CreateCoordArray();
  DrawTetromino();
}

function DrawTetrisLogo() {
  ctx.drawImage(tetrisLogo, 300,8,161,54)
}

function DrawTetromino() {
  for (let i = 0; i < currentTetromino.length; i++) {
    let x = currentTetromino[i][0] + startX;
    let y = currentTetromino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = currentTetrominoColor;
    ctx.fillRect(coorX,coorY,21,21);
  }
}
