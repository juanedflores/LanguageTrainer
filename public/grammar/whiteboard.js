let currentPath = [];
var drawing = [];

function setup() {
  canvas = createCanvas(displayWidth, displayHeight);
  canvas.mousePressed(startPath);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  canvas.style("style", "block");
}

function startPath() {
  currentPath = [];
  drawing.push(currentPath);
}

function draw() {
  if (mouseIsPressed) {
    var point = {
      x: mouseX,
      y: mouseY
    };
    currentPath.push(point);
  }

  function windowResized() {
    resizeCanvas(displayWidth, displayHeight);
  }

  stroke(0);
  strokeWeight(3);
  noFill();
  for (let i = 0; i < drawing.length; i++) {
    const path = drawing[i];
    beginShape();
    for (let j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
}
