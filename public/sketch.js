let germanWord =
  "Tap for new word\nSwipe left/right to change language\nSwipe up/down to toggle definition";
let spanishWord = "";
let englishWord = "";
let definitionWord = "";
let wordType = "";
let wordText;
let language = 0;
let definition = 0;
let germanGender = "000000";
let spanishGender = 0;

let msg = new SpeechSynthesisUtterance();

/*
 * P5js setup function
 */
function setup() {
  createCanvas(windowWidth, windowHeight);

  wordText = createDiv("Hello");
  wordText.attribute("lang", "de");
  wordText.style("color", "#ffffff");
  wordText.style("font-size", "4vw");
  wordText.style("padding", "8vw");
  wordText.center();

  ////let msg = new SpeechSynthesisUtterance();
  let voices = window.speechSynthesis.getVoices();
  let index = 0;
  window.speechSynthesis.getVoices().some(function(voice) {
    if (voice.name == "Anna") {
      return index;
    }
    index += 1;
    //console.log(voice.name, voice.default ? voice.default :'');
  });
  msg.voice = voices[index];

  gender = color(255);
  germanGender = color(0);

  // set options to prevent default behaviors for swipe, pinch, etc.
  const options = {
    preventDefault: true
  };
  const hammer = new Hammer(document.body, options);
  hammer.get("swipe").set({
    direction: Hammer.DIRECTION_ALL
  });
  hammer.on("swipe", swiped);
  hammer.on("tap", getWord);
}

function swiped(event) {
  if (event.direction == 4) {
    if (definition == 0) {
      language = language + 1;
    }
  } else if (event.direction == 8) {
    definition = definition + 1;
    language = 0;
  } else if (event.direction == 16) {
    definition = definition - 1;
    language = 0;
  } else if (event.direction == 2) {
    if (definition == 0) {
      language = language - 1;
    }
  }
  // wrap language back around
  if (language > 2) {
    language = 0;
  } else if (language < 0) {
    language = 2;
  }

  if (definition > 1) {
    definition = 0;
  } else if (definition < 0) {
    definition = 1;
  }

  // speak the definition if it appears on screen
  if (definition == 1) {
    msg.text = definitionWord;
    speechSynthesis.speak(msg);
  }
}

async function getWord() {
  // Fetch to get the current database.
  await fetch("/words", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      wordType = data.type;
      if (data.german != null && data.german != germanWord) {
        germanWord = data.german;
        // determine german gender
        const germanArticle = split(data.german, " ")[0];
        if (germanArticle.toLowerCase() == "der") {
          germanGender = color(0, 0, 255);
        } else if (germanArticle.toLowerCase() == "die") {
          germanGender = color(255, 0, 0);
        } else if (germanArticle.toLowerCase() == "das") {
          germanGender = color(30, 130, 0);
        } else {
          germanGender = color(0);
        }
      } else {
        //germanWord = "null";
        //getWord()
      }
      if (data.spanish != null && data.spanish != spanishWord) {
        spanishWord = data.spanish;
        const spanishArticle = split(data.spanish, " ")[0];
        if (spanishArticle.toLowerCase() == "el") {
          spanishGender = color(93, 144, 173);
        } else if (spanishArticle.toLowerCase() == "la") {
          spanishGender = color(179, 124, 89);
        }
      } else {
        //spanishWord = "null";
        //getWord()
      }
      if (data.english != null && data.english != englishWord) {
        englishWord = data.english;
      } else {
        //englishWord = "null";
        //getWord()
      }
      if (
        data.germanDefinition != null &&
        data.germanDefinition != definitionWord
      ) {
        definitionWord = data.germanDefinition;
      } else {
        //definitionWord = "null";
        //getWord()
      }
    })
    .catch(err => console.log(err));

  msg.text = germanWord;
  speechSynthesis.speak(msg);

  language = 0;
  definition = 0;
}

/*
 * P5js draw function.
 */
function draw() {
  background(0);
  if (definition == 0) {
    if (language == 0) {
      background(germanGender);
      wordText.html(germanWord);
    } else if (language == 1) {
      background(0);
      wordText.html(englishWord);
    } else if (language == 2) {
      background(spanishGender);
      wordText.html(spanishWord);
    }
  } else {
    background(0);
    wordText.html(definitionWord);
  }
  wordText.center();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
