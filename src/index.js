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

app.get('/client/*', (req, res) => {
  res.sendfile(path.join(__dirname, '../client/dist/index.html'))
})
app.get('/', (req, res) => {
  res.sendfile(path.join(__dirname, '../host/dist/index.html'))
})

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

        session.on('update', session => {
          console.log('SESSION UPDATE -> ' + session.state.name)
          io.to(session.id).emit('SESSION_UPDATE', session)
        })
      }

      if (session) io.to(session.id).emit('SESSION_UPDATE', session.toObject())
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
      const index = session.state.addPlayer(name) - 1
      socket.emit('PLAYER', index)
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [joinGame]: ${e.toString()}`
      })
      console.error(`Error in [joinGame]: ${e.toString()}`)
    }
  })

  socket.on('playersReady', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      session.state.playersReady()
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [playersReady]: ${e.toString()}`
      })
      console.error(`Error in [playersReady]: ${e.toString()}`)
    }
  })

  socket.on('startGame', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      session.state.startGame()
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [startGame]: ${e.toString()}`
      })
      console.error(`Error in [startGame]: ${e.toString()}`)
    }
  })

  socket.on('startMove', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      session.state.startMove(msg.diceResult)
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [startMove]: ${e.toString()}`
      })
      console.error(`Error in [startMove]: ${e.toString()}`)
    }
  })

  socket.on('endMiniGame', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      session.state.endMinigame(msg.playerScores)
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [endMiniGame]: ${e.toString()}`
      })
      console.error(`Error in [endMiniGame]: ${e.toString()}`)
    }
  })

  socket.on('rematch', (msg) => {
    try {
      const session = sessions[msg.sessionId]
      session.state.rematch()
    } catch (e) {
      socket.emit('ERROR', {
        errorType: e.name,
        errorText: `Error in [startGame]: ${e.toString()}`
      })
      console.error(`Error in [startGame]: ${e.toString()}`)
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
