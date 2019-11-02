const gameEl = document.getElementById('game')
const button = document.getElementById('btn')

const params = new URLSearchParams(window.location.search)
const playerId = params.get('playerId')

let gameEnded = false
let playerScores = {}
playerScores[playerId] = 0
gameEl.innerText = playerScores[playerId]

button.addEventListener('click', event => {
  playerScores[playerId]++
  gameEl.innerText = playerScores[playerId]

  parent.postMessage({
    source: 'minigame',
    playerId,
    score: playerScores[playerId]
  }, 'http://localhost:8081')
})

window.addEventListener('message', msg => {
  if (msg.data.source === 'minigame') {
    if (msg.data.playerId !== playerId) {
      playerScores[msg.data.playerId] = msg.data.score
    }
    testWin()
  }
})

function testWin () {
  Object.keys(playerScores).forEach(key => {
    if (playerScores[key] >= 10) {
      // Someone has won.
      if (key === playerId) {
        // I have won.
        document.getElementById('you_win').style.display = 'block'
      } else {
        // Someone else has won.
        document.getElementById('you_lose').style.display = 'block'
      }

      // I am the master player and must report the results
      if (playerId === '0') {
        sendWinSignal(playerScores)
      }
    }
  })
}

function sendWinSignal (playerScores) {
  if (!gameEnded) {
    setTimeout(() => {
      parent.postMessage({
        source: 'minigame',
        event: 'win',
        playerScores
      }, 'http://localhost:8081')

      gameEnded = true
    }, 1000)
  }
}
