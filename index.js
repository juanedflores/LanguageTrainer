const express = require("express");
const app = express();
const Datastore = require("nedb");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(
  process.env.SHEETS_ID
);
require("dotenv").config();
const fs = require("fs");
const germandir = "./public/grammar/germanlessons";
const spanishdir = "./public/grammar/spanishlessons";

let lastdoc = 0;
let lastsheet = 0;
let lastlesson = 0;

// open up port and listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static("public"));
// use json
app.use(express.json({ limit: "1mb" }));
// load database
const database = new Datastore("vocab.db");
database.loadDatabase(function(err) {
  database.find({}, function(err, docs) {
    // console.log(err || docs);
  });
});

/*
 * Asynchronous function to access spreadsheets.
 */
async function accessSpreadsheet() {
  let word1;
  let word2;
  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY
    });
    /// / loads document properties and worksheets
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    console.log(rows.length);
    let index = Math.floor(Math.random() * rows.length + 1);
    while (index == lastsheet) {
      index = Math.floor(Math.random() * rows.length + 1);
    }
    lastsheet = index;
    await sheet.loadCells("C" + index + ":D" + index);
    word1 = sheet.getCellByA1("C" + index).value;
    word2 = sheet.getCellByA1("D" + index).value;
    // use API
  } catch (err) {
    console.log(err);
  }
  return {
    first: word1,
    second: word2
  };
}

/*
 * Server POST request method.
 * Accepts the data enclosed in the body of the request message.
 */
app.post("/api", (request, response) => {
  console.log("got a request from client!");
  // get the data from client
  const data = request.body;
  // add a timestamp
  const timestamp = Date.now();
  data.timestamp = timestamp;
  // insert the data to database
  database.insert(data, function(err, wordAdded) {
    if (err) console.log("There's a problem with the database: ", err);
    else if (wordAdded) console.log("New word inserted in the database");
  });
  // send back to client
  response.json(data);
});

app.get("/words", (request, response) => {
  // get a random doc from database.
  database.count({}, function(err, count) {
    if (!err && count > 0) {
      let skipCount = Math.floor(Math.random() * count);
      while (skipCount == lastdoc) {
        skipCount = Math.floor(Math.random() * count);
      }
      lastdoc = skipCount;
      database
        .find({})
        .skip(skipCount)
        .limit(1)
        .exec(function(err2, docs) {
          if (!err2) {
            response.send(docs[0]);
          }
        });
    }
  });
});

app.get("/spreads", (request, response) => {
  accessSpreadsheet().then(val => response.send(val));
});

app.get("/lessons", (request, response) => {
  fs.readdir(germandir, (err, files) => {
    let index = 0;
    if (files.length > 1) {
      index = Math.floor(Math.random() * files.length);
      while (index == lastlesson) {
        index = Math.floor(Math.random() * files.length);
      }
      lastlesson = index;
    }
    let file = files[index];

    fs.readFile("public/grammar/germanlessons/" + file, "utf8", function read(err, data) {
      if (err) {
        throw err;
      }
      const content = data;
      let message = { first: content };
      response.send(message);
    });
  });
});

app.post("/savelesson", (request, response) => {
  //console.log(request.body.one);

  fs.readdir(germandir, "utf8", (err, files) => {
    let total = files.length;
    //console.log(total)
    let text = request.body.one;
    let s = text.search("<title>");
    let e = text.search("</title>");
    if (s > 1) {
      let title = text.substring(s + 7, s + (e - s));
      fs.appendFile(
        "public/grammar/lessons/" + title,
        request.body.one,
        function(err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );
    }
  });
});
