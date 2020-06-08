let germanWord = "";
let spanishWord = "";
let englishWord = "";
let language = 0;
let germanGender = "000000";
const spanishGender = 0;

/*
 * P5js setup function
 */
function setup () {
  createCanvas(windowWidth, windowHeight);

  wordText = createDiv('Hello');
  wordText.style('color', '#ffffff');
  wordText.style('font-size', '20vw');
  wordText.center();

  gender = color(255);
  germanGender = color(255);

  // set options to prevent default behaviors for swipe, pinch, etc.
  const options = {
    preventDefault: true
  };
  const hammer = new Hammer(document.body, options);
  hammer.get('swipe').set({
    direction: Hammer.DIRECTION_ALL
  });
  hammer.on("swipe", swiped);
  hammer.on("tap", getWord);
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
  if (language > 2) {
    language = 0;
  } else if (language < 0) {
    language = 2;
  }
}

function tapped (event) {
  console.log(event);
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
      console.log(data.spanish);
      console.log(data.english);

      if (data.german != null) {
        germanWord = data.german;
        // determine german gender
        const article = split(data.german, ' ')[0];
        if (article.toLowerCase() == "der") {
          germanGender = color(0, 0, 255);
        } else if (article.toLowerCase() == "die") {
          germanGender = color(255, 0, 0);
        } else if (article.toLowerCase() == "das") {
          germanGender = color(0, 255, 0);
        } else {
          germanGender = color(255);
        }
      } else {
        germanWord = "null";
      }
      if (data.spanish != null) {
        spanishWord = data.spanish;
      } else {
        spanishWord = "null";
      }
      if (data.english != null) {
        englishWord = data.english;
      } else {
        englishWord = "null";
      }
    })
    .catch(err => console.log(err));
}

/*
 * P5js draw function.
 */
function draw () {
  background(0);
  textSize(100);
  textAlign(CENTER);
  fill(255);
  if (language == 0) {
    background(germanGender);
    wordText.html(germanWord);
  } else if (language == 1) {
    background(0);
    wordText.html(englishWord);
  } else if (language == 2) {
    background(0);
    wordText.html(spanishWord);
  }
  wordText.center();
}
