var WebSocketServer = require('ws').Server
var http = require('http')
var express = require('express')
var fs = require('fs')
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
  var id = setInterval(function () {
    var fileName = './data/' + randomInt(0, 14) + '.json'

    fs.readFile(fileName, "utf8", function (error, data) {
      if (error) console.log('fs.readFile error', error)
      // console.log("fs.readfile data DEBUG ************", (typeof data), data)

      if (data) {
        ws.send(data, function (error) {
          if (error) {
            console.log("ws.send error", error)
          } else {
            // console.log("ws.send callback: data has been sent to the client")
          }
        })/
      } else {
        console.log("data hasn't been sent because it was", (typeof data), data)
      }
    })

  }, randomInt(3000, 30000))

  console.log("websocket connection open")

  ws.on("close", function () {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
