const gameEl = document.getElementById('game')
const button = document.getElementById('btn')

const params = new URLSearchParams(window.location.search)
const playerId = params.get('playerId')
const players = JSON.parse(params.get('players'))

let gameEnded = false
let playerScores = {}
for (let i = 0; i < players.length; i++) playerScores[i] = 0
gameEl.innerText = playerScores[playerId]

button.addEventListener('click', event => {
  playerScores[playerId]++
  gameEl.innerText = playerScores[playerId]

  parent.postMessage({
    source: 'minigame',
    playerId,
    score: playerScores[playerId]
  }, '*')
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
    const ranking = Object.keys(playerScores).sort((a,b) => playerScores[b] - playerScores[a])

    const points = new Array(players.length).fill(0)
    Object.keys(playerScores).forEach(key => {
      points[parseInt(key)] = playerScores[key]
    })

    console.log(ranking, points)

    setTimeout(() => {
      parent.postMessage({
        source: 'minigame',
        event: 'win',
        playerScores: {
          ranking,
          points
        }
      }, '*')

      gameEnded = true
    }, 1000)
  }
}
