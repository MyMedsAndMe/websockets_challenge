var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

var randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function (ws) {
  // send data in a random interval between 3 and 30 seconds
  setInterval(function () {
    ws.send(
      JSON.stringify(
        require('./data/' + randomInt(0, 14) + '.json'
    )));
  }, randomInt(3000, 30000));

  console.log("websocket connection open")

  ws.on("close", function () {
    console.log("websocket connection close")
  })
})
