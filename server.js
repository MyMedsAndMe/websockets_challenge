#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
// var jsonFile = require('./medications.json');
var now = function () {
  return '[' + new Date().toUTCString() + '] ';
}
var randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var index = fs.readFileSync('public/index.html');
var server = http.createServer(function (request, response) {
  console.log(now() + 'Received request from ' + request.url);
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end(index);
});

var port = (process.env.PORT || 5000);
server.listen(port, function () {
  console.log(now() + 'Server is listening on port:' + port);
});

var wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production 
  // applications, as it defeats all standard cross-origin protection 
  // facilities built into the protocol and the browser.  You should 
  // *always* verify the connection's origin and decide whether or not 
  // to accept it. 
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin 
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  
  var connection = request.accept('echo-protocol', request.origin);   
  console.log("Connection accepted from origin " + request.origin);

  // send data in a random interval between 3 and 30 seconds
  setInterval(function () {
    connection.sendUTF(JSON.stringify(require('./data/' + randomInt(0, 14) + '.json')));
  }, randomInt(3000, 30000));

  connection.on('message', function (message) {
    console.log(now() + 'Received Message: ' + message.utf8Data);

    if (message.type === 'utf8') {
      connection.sendUTF("You are not supposed to talk to me, human.");
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log(now() + 'Connection closed (reason: ' + reasonCode + '). ' + description + '.');
  });
});

