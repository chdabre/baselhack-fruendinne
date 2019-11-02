import GameSession from './GameSession'
import Minigame from './Minigame'
const path = require('path')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const PORT = process.env.PORT || 3000

let sessions = {}

// Static Files
app.use(express.static(path.join(__dirname, '../host/dist')))
app.use('/client', express.static(path.join(__dirname, '../client/dist')))
app.use('/minigame', express.static(path.join(__dirname, '../minigames')))

http.listen(PORT, () => {
  console.log('listening on *' + PORT)

  console.log(Minigame.loadGames())
})

io.on('connection', socket => {
  console.log('[connect] Socket Connected!')

  socket.on('requestSession', (msg) => {
    try {
      console.log(`[requestSession] Session requested`)

      const id = msg ? msg.id : null
      let session

      if (id) {
        // Get existing session
        if (typeof sessions[id] !== 'undefined') {
          session = sessions[id]
          socket.join(id)
        } else {
          socket.emit('ERROR', {
            errorType: 'SessionDoesNotExist',
            errorText: `The requested Session is invalid or does not exist.`
          })
        }
      } else {
        // Create new session
        console.log(`[requestSession] Creating new Session...`)
        session = new GameSession()
        sessions[session.id] = session
        socket.join(session.id)
      }

      socket.emit('SESSION', session)
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [requestSession]: ${e.toString()}`
      })
      console.error(`Error in [requestSession]: ${e.toString()}`)
    }
  })

  socket.on('joinGame', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      const name = msg.name
      const index = session.addPlayer(name) - 1

      io.to(session.id).emit('SESSION', session)
      socket.emit('PLAYER', index)
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [joinGame]: ${e.toString()}`
      })
      console.error(`Error in [joinGame]: ${e.toString()}`)
    }
  })

  socket.on('startGame', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      session.startGame()

      io.to(session.id).emit('SESSION', session)
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [joinGame]: ${e.toString()}`
      })
      console.error(`Error in [joinGame]: ${e.toString()}`)
    }
  })

  socket.on('winGame', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      session.endMinigame(msg.playerScores)

      io.to(session.id).emit('SESSION', session)
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [joinGame]: ${e.toString()}`
      })
      console.error(`Error in [joinGame]: ${e.toString()}`)
    }
  })

  socket.on('MINIGAME', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      io.to(session.id).emit('MINIGAME', msg.msg)
    } catch (e) {
      console.error(`Error in [MINIGAME]: ${e.toString()}`)
    }
  })
})
