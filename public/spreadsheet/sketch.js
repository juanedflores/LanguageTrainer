let text;
let translation1 = "";
let translation2 = "";
let textToDisplay = "tap to start & swipe left/right for toggling translation";

// interactivity
let toggleTranslation = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  text = createDiv();
  text.style("color", "#ffffff");
  text.style("font-size", "8vw");
  text.style("padding", "8vw");
  text.center();

  const options = {
    preventDefault: true
  };
  const hammer = new Hammer(document.body, options);
  hammer.get("swipe").set({
    direction: Hammer.DIRECTION_ALL
  });
  hammer.on("swipe", swiped);
  hammer.on("tap", getTranslations);
}

function swiped(event) {
  if (event.direction == 4 || 2) {
    // swipe right or left
    toggleTranslation = !toggleTranslation;
  }
  if (toggleTranslation) {
    textToDisplay = translation1;
  } else {
    textToDisplay = translation2;
  }
}

async function getTranslations() {
  await fetch("/spreads", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      translation1 = data.first;
      translation2 = data.second;
    })
    .catch(err => console.log(err));
  console.log(translation1 + " " + translation2);
  textToDisplay = translation1;
}

function draw() {
  background(0);
  text.html(textToDisplay);
  text.center();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
