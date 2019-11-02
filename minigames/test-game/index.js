const gameEl = document.getElementById('game')
const button = document.getElementById('btn')

const params = new URLSearchParams(window.location.search)
const playerId = params.get('playerId')

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
    if (playerScores[key] >= 100) {

    }
  })
}

function sendWinSignal () {
  parent.postMessage({
    source: 'minigame',
    event: 'win'
  }, 'http://localhost:8081')
}
