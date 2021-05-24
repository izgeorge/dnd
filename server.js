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
db.defaults({ campaign: {
  title: '',
  players: {}
} }).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.js');
});

app.get('/campaign', function (request, response) {
  const campaign = db.get('campaign').value();
  const formattedCampaign = {
    ...campaign,
    players: Object.values(campaign.players)
  }
  response.send(formattedCampaign);
});

// creates a new campaign
app.post('/campaign', function (request, response) {
  db.get('campaign')
    .assign(request.body)
    .write();
  console.log('New campaign inserted in the database');
  response.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('update player', (data) => {
    const selectedPlayer = db.get('campaign.players').find({ id: data.id });
    
    selectedPlayer.assign({ pos: data.pos }).write();
    io.emit('update player', selectedPlayer);
  })
});

// listen for requests :)
var listener = server.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
