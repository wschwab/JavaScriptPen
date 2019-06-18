const RADIUS = 200;
const X_CIRCLE_CENTER = 300;
const Y_CIRCLE_CENTER = 300;
let canvas;
let ctx;

class MousePosition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let mousePos = new MousePosition(0,0);
document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  drawCanvas();
  canvas.addEventListener("mousemove", redrawCanvas);
}

function drawCanvas() {
  drawRectangle("#839192", 5, 0, 0, 600, 600);
  drawCircle("#839192", 1, X_CIRCLE_CENTER, Y_CIRCLE_CENTER, RADIUS, 0, 2 * Math.PI);
  drawLine("#839192", 1, X_CIRCLE_CENTER, 0, X_CIRCLE_CENTER, 600);
  drawLine("#839192", 1, 0, Y_CIRCLE_CENTER, 600, Y_CIRCLE_CENTER);
}

function redrawCanvas(evt) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCanvas();
  getMousePosition(evt);
  drawTextAtPoint("X : " + mousePos.x, 15, 25);
  drawTextAtPoint("Y : " + mousePos.y, 15, 45);
  let angleOfMouseDegrees = getAngleUsingXAndY(mousePos.x, mousePos.y);
  drawTextAtPoint("Degrees : " + angleOfMouseDegrees, 15, 65);
  drawTriangle(angleOfMouseDegrees);
}

function drawRectangle(strokeColor, lineWidth, startX, startY, endX, endY) {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(startX, startY, endX, endY);
}

function drawCircle(strokeColor, lineWidth, xCircleCenter, yCircleCenter, radius, arcStart, arcEnd) {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(xCircleCenter, yCircleCenter, radius, arcStart, arcEnd);
  ctx.stroke();
}

function drawLine(strokeColor, lineWidth, startX, startY, endX, endY) {
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function drawTextAtPoint(text, x, y) {
  ctx.font = "15px Arial";
  ctx.fillText(text,x,y);
}

function getMousePosition(evt) {
  let canvasDimensions = canvas.getBoundingClientRect();
  mousePos.x = Math.floor(evt.clientX - canvasDimensions.left);
  mousePos.y = Math.floor(evt.clientY - canvasDimensions.top);
  mousePos.x -= 300;
  mousePos.y = -1 * (mousePos.y - 300);

  return mousePos;
}

function getAngleUsingXAndY(x,y) {
  let adjacent = x;
  let opposite = y;
  return radiansToDegrees(Math.atan2(opposite, adjacent));
}

function radiansToDegrees(rad) {
  if (rad < 0) {
    return (360.0 + (rad * (180/Math.PI))).toFixed(2);
  } else {
    return (rad * (180/Math.PI)).toFixed(2);
  }
}

function degreesToRadians(degree) {
  return (degree * (Math.PI/180));
}

function drawTriangle(angleDegrees) {
  ctx.moveTo(X_CIRCLE_CENTER, Y_CIRCLE_CENTER);
  let endX = X_CIRCLE_CENTER + RADIUS * Math.cos(degreesToRadians(angleDegrees));
  let endY = Y_CIRCLE_CENTER + RADIUS * -(Math.sin(degreesToRadians(angleDegrees)));

  drawTextAtPoint("Radians : " + degreesToRadians(angleDegrees).toFixed(2), 15, 85);

  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX, 300);
  ctx.stroke();
  drawTextAtPoint("(" + endX.toFixed(2) + "," + endY.toFixed(2) + ")", endX + 10, endY - 10);

  let hypotLength = getLineLength(X_CIRCLE_CENTER, Y_CIRCLE_CENTER, endX, endY);
  drawTextAtPoint("Hypotenuse Length : " + hypotLength.toFixed(2), 15, 105);

  let oppLength = getLineLength(endX, endY, endX, 300);
  drawTextAtPoint("Opposite Length : " + oppLength.toFixed(2), 15, 125);

}

function getLineLength(x1, y1, x2, y2) {
  let xS = x2 - x1;
  xS = xS * xS;
  let yS = y2 - y1;
  yS = yS * yS;

  return Math.sqrt(xS + yS);
}
