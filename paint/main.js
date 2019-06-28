let canvas;
let ctx;
let savedImageData;
let dragging = false;
let strokeColor = 'black';
let fillColor = 'black';
let line_Width = 2;
let polygonSides = 6;
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;

let usingBrush = false;
let brushXPoints = new Array();
let brushYPoints = new Array();
let brushDownPos = new Array();

class ShapeBoundingBox {
  constructor(left, top, width, height) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }
}

class MouseDownPos {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

class Location {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

class PolygonPoint {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

let shapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
let mousedown = new MouseDownPos(0,0);
let loc = new Location(0,0);

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = line_Width;
  canvas.addEventListener("mousedown", ReactToMouseDown);
  canvas.addEventListener("mousemove", ReactToMouseMove);
  canvas.addEventListener("mouseup", ReactToMouseUp);
}

function ChangeTool(toolClicked) {
  document.getElementById('open').className = "";
  document.getElementById('save').className = "";
  document.getElementById('brush').className = "";
  document.getElementById('line').className = "";
  document.getElementById('rectangle').className = "";
  document.getElementById('circle').className = "";
  document.getElementById('ellipse').className = "";
  document.getElementById('polygon').className = "";

  document.getElementById(toolClicked).className = 'selected';
  currentTool = toolClicked;
}

function GetMousePosition(x,y) {
  let canvasSizeData = canvas.getBoundingClientRect();
  return { x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
          y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.canvasHeight)};
}

function SaveCanvasImage() {
  savedImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
}

function RedrawCanvasImage() {
  ctx.putImageData(savedImageData,0,0);
}

function UpdateRubberbandSizeData(loc) {
  shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
  shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

  if (loc.x > mousedown.x) {
    shapeBoundingBox.left = mousedown.x;
  } else {
    shapeBoundingBox.left = loc.x;
  }

  if (loc.y > mousedown.y) {
    shapeBoundingBox.top = mousedown.y;
  } else {
    shapeBoundingBox.top = loc.y;
  }
}

function getAngleUsingXAndY(mouselocX, mouselocY) {
  let adjacent = mousedown.x - mouselocX;
  let opposite = mousedown.y - mouselocY;

  return radiansToDegrees(Math.atan2(opposite, adjacent));
}

function radiansToDegrees(rad) {
  if (rad < 0) {
    return (360.0 + (rad * (180 / Math.PI))).toFixed(2);
  } else {
    return (rad * (180 / Math.PI)).toFixed(2);
  }
}

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function getPolygonPoints() {
  let angle = degreesToRadians(getAngleUsingXAndY(loc.x, loc.y));
  let radiusX = shapeBoundingBox.width;
  let radiusY = shapeBoundingBox.height;
  let polygonPoints = [];
  for (var i = 0; i < polygonSides; i++) {
    polygonPoints.push(new PolygonPoint(loc.x + radiusX * Math.sin(angle), loc.y - radiusY * Math.cos(angle)));
    angle += 2 * Math.PI / polygonSides;
  }
  return polygonPoints;
}

function getPolygon() {
  let polygonPoints = getPolygonPoints();
  ctx.beginPath();
  ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
  for (var i = 1; i < polygonSides; i++) {
    ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
  }
  ctx.closePath();
}

function drawRubberbandShape(loc) {
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  if (currentTool === 'brush') {
    DrawBrush();
  } else if (currentTool === 'line') {
    ctx.beginPath();
    ctx.moveTo(mousedown.x, mousedown.y);
    ctx.lineTo(loc.x, loc.y);
    ctx.stroke();
  } else if (currentTool === 'rectangle') {
    ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
  } else if (currentTool === 'circle') {
    let radius = shapeBoundingBox.width;
    ctx.beginPath();
    ctx.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (currentTool === 'ellipse') {
    let radiusX = shapeBoundingBox.width / 2;
    let radiusY = shapeBoundingBox.height / 2;
    ctx.beginPath();
    ctx.ellipse(mousedown.x, mousedown.y, radiusX, radiusY, Math.PI / 4, 0, Math.PI * 2);
  } else if (currentTool === 'polygon') {
    getPolygon();
    ctx.stroke();
  }

}

function UpdateRubberbandOnMove(loc) {
  UpdateRubberbandSizeData(loc);
  drawRubberbandShape(loc);
}

function AddBrushPoint(x,y, mouseDown) {
  brushXPoints.push(x);
  brushYPoints.push(y);
  brushDownPos.push(mouseDown);
}

function DrawBrush() {
  for (var i = 0; i < brushXPoints.length; i++) {
    ctx.beginPath();
    if (brushDownPos[i]) {
      ctx.moveTo(brushXPoints[i-1], brushYPoints[i-1]);
    } else {
      ctx.moveTo(brushXPoints[i]-1, brushYPoints[i]-1);
    }
    ctx.lineTo(brushXPoints[i], brushYPoints[i]);
    ctx.closePath();
    ctx.stroke();
  }
}

function ReactToMouseDown(evnt) {
  canvas.style.cursor = "crosshair";
  loc = GetMousePosition(evnt.clientX, evnt.clientY);
  SaveCanvasImage();
  mousedown.x = loc.x;
  mousedown.y = loc.y;
  dragging = true;

  if (currentTool === 'brush') {
    usingBrush = true;
    AddBrushPoint(loc.x, loc.y);
  }
}

function ReactToMouseMove(evnt) {
  canvas.style.cursor = "crosshair";
  loc = GetMousePosition(evnt.clientX, evnt.clientY);
  if (currentTool === 'brush' && dragging && usingBrush) {
    if (loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight) {
      AddBrushPoint(loc.x, loc.y, true);
    }
    RedrawCanvasImage();
    DrawBrush();
  } else {
    if (dragging) {
      RedrawCanvasImage();
      UpdateRubberbandOnMove(loc);
    }
  }
}

function ReactToMouseUp(evnt) {
  canvas.style.cursor = "default";
  loc = GetMousePosition(evnt.clientX, evnt.clientY);
  RedrawCanvasImage();
  UpdateRubberbandOnMove(loc);
  dragging = false;
  usingBrush = false;
}

function SaveImage() {
  var imageFile = document.getElementById('img-file');
  imageFile.setAttribute('download', 'image.png');
  imageFile.setAttribute('href', canvas.toDataURL());
}

function OpenImage() {
  let img = new Image();
  img.onload = function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0);
  }
  img.src = 'image.png';
}
