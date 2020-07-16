// DOM element.
let div;

// To hold the received translations, definition, and grammatic word type.
let germanWord =
  "Tap for new word\nSwipe left/right to change language\nSwipe up/down to toggle definition";
let spanishWord = "";
let englishWord = "";
let definitionWord = "";
let wordType = "";

// For keeping track of what language currently on, or if viewing definition.
let language = 0;
let definition = 0;

// For background color.
let germanGender = 0;
let spanishGender = 0;

// Text to speech.
let msg = new SpeechSynthesisUtterance();

/*
 * P5js setup function
 */
function setup() {
  createCanvas(windowWidth, windowHeight);

  div = createDiv();
  div.attribute("lang", "de");
  div.style("color", "#ffffff");
  div.style("font-size", "5vw");
  div.style("padding", "8vw");
  div.center();

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

  getSpeech();
}

/*
 * Set up text to speech.
 */
function getSpeech() {
  let voices = window.speechSynthesis.getVoices();
  let index = 0;
  window.speechSynthesis.getVoices().some(function(voice) {
    if (voice.name == "Anna") {
      return index;
    }
    index += 1;
  });
  msg.voice = voices[index];
}

/*
 * Handle Swipe Events.
 */
function swiped(event) {
  if (event.direction == 4) {
    // Right swipe.
    if (definition == 0) {
      language = language + 1;
    }
  } else if (event.direction == 8) {
    // Top swipe.
    definition = definition + 1;
    language = 0;
  } else if (event.direction == 16) {
    // Down swipe.
    definition = definition - 1;
    language = 0;
  } else if (event.direction == 2) {
    // Left swipe.
    if (definition == 0) {
      language = language - 1;
    }
  }

  // Wrap language back around.
  if (language > 2) {
    language = 0;
  } else if (language < 0) {
    language = 2;
  }

  // Wrap up/down modes around.
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
  loop();
}

/*
 * Retrieve and handle a new word from database.
 */
async function getWord() {
  await fetch("/words", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      germanWord = data.german;
      spanishWord = data.spanish;
      englishWord = data.english;
      wordType = data.type;
      definitionWord = data.germanDefinition;

      // [NOUNS]
      // Determine the genders of words for german and spanish.
      if (data.type == "noun") {
        if (data.german != null) {
          const germanArticle = split(data.german, " ")[0];
          if (germanArticle.toLowerCase() == "der") {
            germanGender = color(0, 0, 255);
          } else if (germanArticle.toLowerCase() == "die") {
            germanGender = color(255, 0, 0);
          } else if (germanArticle.toLowerCase() == "das") {
            germanGender = color(30, 130, 0);
          }
        }
        if (data.spanish != null) {
          const spanishArticle = split(data.spanish, " ")[0];
          if (spanishArticle.toLowerCase() == "el") {
            spanishGender = color(93, 144, 173);
          } else if (spanishArticle.toLowerCase() == "la") {
            spanishGender = color(179, 124, 89);
          }
        }
      }

      // [VERBS]
      else if (data.type == "verb") {
        germanGender = color(160, 123, 224);
        spanishGender = color(0);
      } else if (data.type == "adjective") {
        germanGender = color(191, 151, 72);
        spanishGender = color(0);
      } else if (data.type == "adverb") {
        germanGender = color(115, 88, 145);
        spanishGender = color(0);
      }
    })
    .catch(err => console.log(err));

  // Speak the new word.
  msg.text = germanWord;
  speechSynthesis.speak(msg);

  // Always start with german word when tap screen.
  language = 0;
  definition = 0;
  loop();
}

/*
 * P5js draw function.
 */
function draw() {
  if (definition == 0) {
    // Viewing a word.
    if (language == 0) {
      background(germanGender);
      div.html(germanWord);
    } else if (language == 1) {
      background(0);
      div.html(englishWord);
    } else if (language == 2) {
      background(spanishGender);
      div.html(spanishWord);
    }
  } else {
    // Viewing a word definition.
    background(0);
    div.html(definitionWord);
  }
  div.center();
  noLoop();
}

/*
 * Handle window resizing.
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
