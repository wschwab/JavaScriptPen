let canvas;
let ctx;
let savedImageData;
let dragging = false;
let strokeColor = 'black';
let fillColor = 'black';
let line_width = 2;
let polygonSides = 6;
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;

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
  ctx.lineWidth = line_width;
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
  ctx.putImageData(savedImageData);
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
  return (rad * (180 / Math.PI)).toFixed(2);
}

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function drawRubberband() {

}

function updateRubberbandOnMove() {

}

function ReactToMouseDown(evnt) {
  canvas.style.cursor = "crosshair";
  loc = GetMousePosition(evnt.clientX, evnt.clientY);
  SaveCanvasImage();
  mousedown.x = loc.x;
  mousedown.y = loc.y;
  dragging = true;


}

function ReactToMouseMove(evnt) {
  canvas.style.cursor = "crosshair";
  loc = GetMousePosition(evnt.clientX, evnt.clientY);


}

function ReactToMouseUp() {
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
