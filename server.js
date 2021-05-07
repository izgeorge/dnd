// const express = require('express');
// const app = express();

// // console.log that your server is up and running
// app.listen(port, () => console.log(`Listening on port ${port}`));

// // create a GET route
// app.get('/players', (req, res) => {
//   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
// });


// server.js
// where your node app starts

// init project
var express = require('express');
// const port = 5000;
// setup a new database
// persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('.data/db.json')
var db = low(adapter)
var app = express();

// default players list
db.defaults({ players: [] }).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.js');
});

app.get('/players', function (request, response) {
  var dbUsers=[];
  var players = db.get('players').value(); // Find all players in the collection
  players.forEach(function(player) {
    dbUsers.push({ name: player.name, pos: player.pos }); // adds their info to the dbUsers value
  });
  response.send(dbUsers); // sends dbUsers back to the page
});

// creates a new entry in the players collection with the submitted values
app.post('/players', function (request, response) {
  db.get('players')
    .push({ name: request.query.name, pos: { x: request.query.pos.x, y: request.query.pos.y } })
    .write();
  console.log('New user inserted in the database');
  response.sendStatus(200);
});

// removes entries from players and populates it with default players
app.get('/reset', function (request, response) {
  // removes all entries from the collection
  db.get('players')
  .remove()
  .write();
  console.log('Database cleared');
  
  // default players inserted in the database
  var players= [];
  
  players.forEach(function(){
    db.get('players').write();
  });
  console.log('Default players added');
  response.redirect('/');
});

// removes all entries from the collection
app.get('/clear', function (request, response) {
  // removes all entries from the collection
  db.get('players')
  .remove()
  .write();
  console.log('Database cleared');
  response.redirect('/');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});