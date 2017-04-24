
// Node dependencies.
const crypto = require('crypto');
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const storage = require('@google-cloud/storage');
const server = express();

// Firebase ID.
// Firebase Project ID and Service Account Key.
const gcs = storage({
  projectId: 'snapshelf-aa1b5', // <--- USE YOURS!
  keyFilename: './serviceAccountKey.json'
});

// Firebase bucket.
// It's the Firebase Project ID + .appspot.com
// USE YOURS!
const bucket = gcs.bucket('snapshelf-aa1b5.appspot.com');

// Configure the port your server in going to use.
// By default it's 3000 if the environment (e.g. Heroku) don't set it.
server.set('port', process.env.PORT || 3000);

// Configure bodyParser.
// bodyParser extract the entire body portion of an incoming request stream
// and exposes it on 'req.body' as something easier to interface with.
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: true
}));

// Handle HTTP POST requests.
// Just a friendly way to check the server status.
server.get('/', (req, res) => {
  res.send('OK').end();
});

// Handle HTTP POST requests.
// Your webhook entry point.
server.post('/', (req, res) => {

  // Debug
  console.log(':::: D E B U G ::::');
  console.log(req.body);

  if (req.body && req.body.processedImageURL) {

    // Get image from Pixelz and save it to Firebase Storage.
    saveImage(req.body.processedImageURL);

    return res.status(200).end();
  }

  res.status(400).end();
});

// Initialize the server.
server.listen(server.set('port'), (error) => {
  if (error) {
    return console.error(error);
  }

  // Debug log.
  // In case you test it first in your local machine.
  console.log(`URL: http://localhost:${server.set('port')}/`);
});

function saveImage(url) {

  // Generate a random HEX string using crypto (a native node module).
  const randomFileName = crypto.randomBytes(16).toString('hex');

  // Fetch image info using a HTTP HEAD request.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
  request.head(url, (error, info) => {
    if (error) {
      return console.error(error);
    }

    // Download image from Pixelz, then save the image to Firebase
    // using the Google Cloud API and the magic of Node Streams.
    // https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/v0.52.0/storage/file
    // http://stackoverflow.com/questions/28355079/how-do-node-js-streams-work
    request(url)
      .pipe(
        bucket.file(`sample/images/${randomFileName}`).createWriteStream({
          metadata: {
            contentType: info.headers['content-type']
          }
        })
      )
      .on('error', (err) => {

        // Do something if the upload fails.
        console.error(err);
      })
      .on('finish', () => {

        // Do something when everything is done.
        console.log('Image successfully uploaded to Firebase Storage!')
      });
  });
}
