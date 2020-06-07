let germanWord = "";
let englishWord = "";
let language = 0;

/*
 * P5js setup function
 */
function setup () {
  createCanvas(windowWidth, windowHeight);
 
  button = createButton('click me');
  button.position(20, 20);
  button.mousePressed(getWord);

  // set options to prevent default behaviors for swipe, pinch, etc.
  const options = {
    preventDefault: true
  };
  const hammer = new Hammer(document.body, options);
  hammer.get('swipe').set({
    direction: Hammer.DIRECTION_ALL
  });
  hammer.on("swipe", swiped);
}

function swiped (event) {
  if (event.direction == 4) {
    console.log("right");
    language = language + 1;
  } else if (event.direction == 8) {
    console.log("up");
  } else if (event.direction == 16) {
    console.log("down");
  } else if (event.direction == 2) {
    console.log("left");
    language = language - 1;
  }
  // wrap language back around
  if (language > 1) {
    language = 0;
  } else if (language < 0) {
    language = 1;
  }
}

async function getWord () {
  // Fetch to get the current database.
  await fetch('/words', {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data.german);
      germanWord = data.german;
      englishWord = data.english;
    });
}

/*
 * P5js draw function.
 */
function draw () {
  background(0);
  fill(255, 0, 0);
  textSize(100);
  textAlign(CENTER);
  text(germanWord, width / 2, height / 2);
}
