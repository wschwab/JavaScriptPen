let canvas;
let ctx;

let DIRECTION = {
  STOPPED: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
}

class Paddle {
  constructor(side) {
    this.width = 15;
    this.height = 65;
    this.x = side === 'left' ? 150 : canvas.width - 150;
    this.y = canvas.height / 2;
    this.score = 0;
    this.move = DIRECTION.STOPPED;
    this.speed = 11;
  }
}

class Ball {
  constructor(newSpeed) {
    this.width = 15;
    this.height = 15;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.moveX = DIRECTION.STOPPED;
    this.moveY = DIRECTION.STOPPED;
    this.speed = newSpeed;
  }
}

let player;
let aiPlayer;
let ball;
let running = false;
let gameOver = false;
let delayAmount;
let targetForBall;
let beepSound;

document.addEventListener('DOMContentLoaded', SetupCanvas);

// SetupCanvas
function SetupCanvas(){
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 1400;
  canvas.height = 1000;
  player = new Paddle('left');
  aiPlayer = new Paddle('right');
  ball = new Ball(7);
  aiPlayer.speed = 6.5;
  targetForBall = player;
  delayAmount = (new Date()).getTime();
  beepSound = document.getElementById('beepSound');
  beepSound.src = 'beep.wav';
  document.addEventListener('keydown', MovePlayerPaddle);
  document.addEventListener('keyup', StopPlayerPaddle);
  Draw();
}

// Draw
function Draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillRect(aiPlayer.x, aiPlayer.y, aiPlayer.width, aiPlayer.height);
  ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

  ctx.font = '80px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(player.score.toString(), (canvas.width/2) - 300, 100);
  ctx.fillText(aiPlayer.score.toString(), (canvas.width/2) + 300, 100);

  if(player.score === 5){
    ctx.fillText("Player Wins", canvas.width/2, 300);
    gameOver = true;
  }
  if(aiPlayer.score === 5){
    ctx.fillText("AI Wins", canvas.width/2, 300);
    gameOver = true;
  }
}
// Update
function Update(){
  if(!gameOver){
    if(ball.x <= 0){
      ResetBall(aiPlayer, player);
    }
    if(ball.x >= canvas.width - ball.width){
      ResetBall(player, aiPlayer);
    }
    if(ball.y <= 0){
      ball.moveY = DIRECTION.DOWN;
    }
    if(ball.y >= canvas.height - ball.height){
      ball.moveY = DIRECTION.UP;
    }

    if(player.move === DIRECTION.DOWN){
      player.y += player.speed;
    }else if (player.move === DIRECTION.UP){
      player.y -= player.speed;
    }

    if(player.y < 0){
      player.y = 0;
    }else if (player.y >= canvas.height - player.height){
      player.height = canvas.height - player.height;
    }

    if(AddADelay() && targetForBall){
      ball.moveX = targetForBall === player ? DIRECTION.LEFT : DIRECTION.RIGHT;
      ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
      ball.y = canvas.height / 2;
      targetForBall = null;
    }

    if(ball.moveY === DIRECTION.UP){
      ball.y -= ball.speed;
    }else if (ball.moveY === DIRECTION.DOWN){
      ball.y += ball.speed;
    }

    if(ball.moveX === DIRECTION.LEFT){
      ball.x -= ball.speed;
    }else if (ball.moveX === DIRECTION.RIGHT){
      ball.x += ball.speed;
    }

    if(aiPlayer > ball.y - (aiPlayer.height / 2)){
      if(ball.moveX === DIRECTION.RIGHT){
        aiPlayer.y -= aiPlayer.speed;
      }
    }

    if(aiPlayer.y < ball.y - (aiPlayer.height / 2)){
      if(ball.moveX === DIRECTION.RIGHT){
        aiPlayer.y += aiPlayer.speed;
      }
    }

    if(aiPlayer.y < 0){
      aiPlayer.y = 0;
    }else if (aiPlayer.y >= canvas.height - aiPlayer.height){
      aiPlayer.height = canvas.height - aiPlayer.height;
    }

    if(ball.x - ball.width <= player.x && ball.x >= player.x - player.width){
      if(ball.y <= player.y + player.height && ball.y + ball.height >= player.y){
        ball.moveX = DIRECTION.RIGHT;
        beepSound.play();
      }
    }

    if(ball.x - ball.width <= aiPlayer.x && ball.x >= aiPlayer.x - aiPlayer.width){
      if(ball.y <= aiPlayer.y + aiPlayer.height && ball.y + ball.height >= aiPlayer.y){
        ball.moveX = DIRECTION.LEFT;
        beepSound.play();
      }
    }


  }
}

// Move Player Paddle
function MovePlayerPaddle(key){
  if(running === false){
    running = true;
    window.requestAnimationFrame(GameLoop);
  }
  if(key.keyCode === 38 || key.keycode === 87) player.move = DIRECTION.UP;
  if(key.keyCode === 40 || key.keycode === 83) player.move = DIRECTION.DOWN;
}

// Stop Player Paddle
function StopPlayerPaddle(evt){
  player.move = DIRECTION.STOPPED;
}

// GameLoop
function GameLoop(){
  Update();
  Draw();
  if(!gameOver) requestAnimationFrame(GameLoop);
}

// Reset Ball
function ResetBall(whoScored, whoLost){
  whoScored.score++;
  let newBallSpeed = ball.speed + 0.2;
  ball = new Ball(newBallSpeed);
  targetForBall = whoLost;
  delayAmount = (new Date()).getTime();
}

// Add Delay
function AddADelay(){
  return ((new Date()).getTime() - delayAmount >= 1000);
}
