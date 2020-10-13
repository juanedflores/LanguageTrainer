let currentPath = [];
var drawing = [];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  canvas.style("style", "block");
  canvas.parent("whiteboard");
  background(0);
}

function mousePressed() {
  currentPath = [];
  drawing.push(currentPath);
  console.log(drawing.length);
}

function draw() {
  if (mouseIsPressed) {
    var point = {
      x: mouseX,
      y: mouseY
    };
    currentPath.push(point);
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

function windowResized() {
  var body = document.body,
    html = document.documentElement;

  var h = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  resizeCanvas(windowWidth, h);
}
