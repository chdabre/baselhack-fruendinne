const button = document.getElementById('btn');
const displayText = document.getElementById('dispText');
var startTime;
var stopTime;
var diffTime;
var tempScore;
var validScores = false;

const params = new URLSearchParams(window.location.search);
const playerId = params.get('playerId');
const players = JSON.parse(params.get('players')); //array of all player

let gameEnded = false;
let playerScores = {}
playerScores[playerId] = 0;
let readyPlayers = {};
let mainExecuted = false;
let readyState = false;


button.addEventListener('click', event => {

  button.style.visibility = 'hidden';
  stopTime = new Date().getTime()
  diffTime = stopTime - startTime

  tempScore = Math.abs(60000 - diffTime)
  playerScores[playerId] = (180000 - tempScore);
  console.log("tempScore = " + tempScore)

  parent.postMessage({
    source: 'minigame',
    playerId,
    score: playerScores[playerId]
  }, 'http://localhost:8081')

});

window.addEventListener('message', msg => {
  if (msg.data.source === 'minigame') {
    if (msg.data.playerId !== playerId) {
      playerScores[msg.data.playerId] = msg.data.score
    }
    testWin()
  }
});


function testWin() {

  if (Object.keys(playerScores).length === players.length)
    validScores = true;

  if (validScores) {
    let winner = true;
    Object.values(playerScores).forEach(val => {
      if (val < tempScore) {
        winner = false;
      }
    });

    // Someone has won.
    if (winner) {
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
}

function sendWinSignal(playerScores) {
  let ranking = Object.keys(playerScores).sort((a, b) => {
    return playerScores[a] - playerScores[b];
  })

  //ranking = Object.keys(playerScores)
  console.log(Object.keys(playerScores).sort((a, b) => {
    return playerScores[a] - playerScores[b];
  }))

  let points = Array.from(ranking);
  for (let i = 0; i < ranking.length; i++) {
    points[i] = playerScores[ranking[i]];
  }

  let winReturn = {ranking, points};

  console.log("WIN RETURN:")
  console.log(winReturn)

  if (!gameEnded) {
    parent.postMessage({
      source: 'minigame',
      event: 'win',
      playerScores: winReturn,
    }, 'http://localhost:8081')

    gameEnded = true
  }
}

function testStart(data) {
  //console.log("testing ready")
  readyPlayers[data.playerId] = data.ready;
  for (player in readyPlayers) {
    if (!player) return false
  }
  return true
}

setup();

function setup() {
  //setup readyPlayers Object
  for (player in players) {
    readyPlayers[player] = false;
  }

  window.addEventListener('message', msg => {
    if (msg.data.source === 'minigame') {
      if (msg.data.playerId !== playerId) {
        playerScores[msg.data.playerId] = msg.data.score

      }
      if (testStart(msg.data)) {
        readyState = true;
        console.log("all ready")
        if (!mainExecuted) main();
        if (!readyState) {
          console.log("not all clients are ready!")
        }
      }
      console.log(playerScores)
      testWin()
    }
  });

  parent.postMessage({
    source: 'minigame',
    playerId,
    score: playerScores[playerId],
    ready: true,
  }, 'http://localhost:8081')

  //needs to move to beginning of setup for testing the game
  main()

}


function main() {
  mainExecuted = true;
  startTime = new Date().getTime();

  button.style.visibility = 'hidden';
  displayText.innerText = "3"

  setTimeout(function () {
    displayText.innerText = "2"
  }, 2000);

  setTimeout(function () {
    displayText.innerText = "1"
  }, 3000);

  setTimeout(function () {
    displayText.innerText = "GO!"
  }, 4000);

  setTimeout(function () {
    displayText.innerText = ""
    button.style.visibility = 'visible';
  }, 4800);

  setTimeout(function () {
    displayText.innerText = "END"
  }, 180000);

}





