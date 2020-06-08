const express = require('express');
const app = express();
const Datastore = require('nedb');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1KbBHMAnh72Nam5I0V54vC3RqmYnJU3DytSW_v20akO8');
require('dotenv').config();

// open up port and listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
// use json
app.use(express.json({ limit: '1mb' }));
// load database
const database = new Datastore('vocab.db');
database.loadDatabase(function (err) {
  database.find({}, function (err, docs) {
    // console.log(err || docs);
  });
});

/*
 * Asynchronous function to access spreadsheets.
 */
async function accessSpreadsheet () {
  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY
    });
    /// / loads document properties and worksheets
    await doc.loadInfo();
    // use API
    await console.log(doc.title);
  } catch (err) {
    console.log(err);
  }
}

/*
 * Server POST request method.
 * Accepts the data enclosed in the body of the request message.
 */
app.post('/api', (request, response) => {
  console.log('got a request from client!');
  // get the data from client
  const data = request.body;
  // add a timestamp
  const timestamp = Date.now();
  data.timestamp = timestamp;
  // insert the data to database
  database.insert(data, function (err, wordAdded) {
    if (err) console.log("There's a problem with the database: ", err);
    else if (wordAdded) console.log("New word inserted in the database");
  });
  // send back to client
  response.json(data);
  accessSpreadsheet();
});

app.get('/words', (request, response) => {
// get a random doc from database.
  database.count({}, function (err, count) {
    if (!err && count > 0) {
      const skipCount = Math.floor(Math.random() * count);
      database.find({}).skip(skipCount).limit(1).exec(function (err2, docs) {
        if (!err2) {
          response.send(docs[0]);
        }
      });
    }
  });
});
