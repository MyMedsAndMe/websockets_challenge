#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
// var jsonFile = require('./medications.json');
var now = function () {
  return '[' + new Date().toUTCString() + '] ';
}
var randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var server = http.createServer(function (request, response) {
  console.log(now() + 'Received request from ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(1337, function () {
  console.log(now() + 'Server is listening on port 1337.');
});

var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', function (request) {
  var connection = request.accept();

  // send data in a random interval between 3 and 30 seconds
  setInterval(function () {
    connection.sendUTF(JSON.stringify(require('./data/' + randomInt(0, 14) + '.json')));
  }, randomInt(3000, 30000));

  connection.on('message', function (message) {
    console.log(now() + 'Received Message: ' + message.utf8Data);

    if (message && message.type === 'utf8') {
      connection.sendUTF("You are not supposed to talk to me, human.");
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log(now() + 'Connection closed (reason: ' + reasonCode + '). ' + description + '.');
  });
});

