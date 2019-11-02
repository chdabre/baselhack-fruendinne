const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const PORT = process.env.PORT || 3000

let sessions = {}

http.listen(PORT, () => {
  console.log('listening on *' + PORT)
})

io.on('connection', socket => {

})
