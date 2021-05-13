const low = require('lowdb')
const express = require('express');
const cors = require('cors')
const http = require('http');
const { Server } = require("socket.io");

const port = 5000;

// setup a new database
// persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('.data/db.json')
const db = low(adapter)
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

app.use(express.json())
app.use(cors())

// default players list
db.defaults({ players: [] }).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.js');
});

app.get('/players', function (request, response) {
  const dbUsers=[];
  const players = db.get('players').value(); // Find all players in the collection
  Object.values(players).forEach(function(player) {
    dbUsers.push({ name: player.name, pos: player.pos }); // adds their info to the dbUsers value
  });
  response.send(dbUsers); // sends dbUsers back to the page
});

// creates a new entry in the players collection with the submitted values
app.post('/players', function (request, response) {
  db.get('players')
    .assign(request.body)
    .write();
  console.log('New user inserted in the database');
  response.sendStatus(200);
});

// updates player position
app.put('/players/:uid', function (request, response) {
  console.log(db.get('players').filter({ id: request.params.uid }))
  
  const selectedPlayer = db.get('players').find({ id: request.params.uid }).assign({ pos: request.body }).write();
  console.log('!!!', selectedPlayer)

  io.emit('update map', db.get('players'));
  console.log('User updated');
  console.log(request.body)
  response.sendStatus(200);
});
// removes entries from players and populates it with default players
// app.get('/reset', function (request, response) {
//   // removes all entries from the collection
//   db.get('players')
//   .remove()
//   .write();
//   console.log('Database cleared');
  
//   // default players inserted in the database
//   var players= [];
  
//   players.forEach(function(){
//     db.get('players').write();
//   });
//   console.log('Default players added');
//   response.redirect('/');
// });

// removes all entries from the collection
// app.get('/clear', function (request, response) {
//   // removes all entries from the collection
//   db.get('players')
//   .remove()
//   .write();
//   console.log('Database cleared');
//   response.redirect('/');
// });

io.on('connection', (socket) => {
  console.log('a user connected');
});

// listen for requests :)
var listener = server.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
