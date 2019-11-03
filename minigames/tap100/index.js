const params = new URLSearchParams(window.location.search)
const playerId = params.get('playerId')
const players = JSON.parse(params.get('players')) //array of all player
let readyPlayers = {};
let mainExecuted = false


let gameEnded = false
let playerScores = {}
let readyState = false; //true if all players are ready
playerScores[playerId] = -1000


let clickCount = 0
let finished = false
let clicker = document.getElementById('clicker')
let fertig = document.getElementById('fertig')

setup();

//game setup function
function setup() {
    //setup readyPlayers Object
    for(player in players){
        readyPlayers[player] = false;
    }
    clicker.disabled =true;
    fertig.disabled = true;


    window.addEventListener('message', msg => {
      if (msg.data.source === 'minigame') {
        if (msg.data.playerId !== playerId) {
          playerScores[msg.data.playerId] = msg.data.score

        }
        if(testStart(msg.data)){
            readyState = true;
            console.log("all ready")
            if(!mainExecuted) main();
        if (!readyState) {
            console.log("not all clients are ready!")
        }
        }
        console.log(playerScores)
        testWin()
      }
    })


    parent.postMessage({
      source: 'minigame',
      playerId,
      score: playerScores[playerId],
      ready: true,
    }, 'http://localhost:8081')

  }

function onClick() {
  clickCount++;
}

function onFertig() {
  let diff = 100 - clickCount;
  //console.log("fertig_callback: " + playerScores)
  playerScores[playerId] = Math.abs(diff);
  finished = true;
  clicker.disabled = true;
  fertig.disabled = true;
  //console.log(clicker.disabled)
  updateClients();
}

function main() {
  mainExecuted = true

  clicker.disabled = false;
  fertig.disabled = false;

}




function updateClients(){

  parent.postMessage({
    source: 'minigame',
    playerId,
    score: playerScores[playerId],
  }, 'http://localhost:8081')
}

function testStart(data){
    //console.log("testing ready")
    readyPlayers[data.playerId] = data.ready;
    for(player in readyPlayers){
        if(!player) return false
    }
    return true
}

function testWin() {
  Object.keys(playerScores).forEach(key => {
    console.log("Scores:" )
    console.log(playerScores)
    console.log("Players:" )
    console.log(players)
    if (Object.keys(playerScores).length === players.length) {
      // Someone has won.
    
      if(playerScores[key] == 0){
        if (key === playerId) {
          // I have won.
          document.getElementById('you_win').style.display = 'block'
          document.getElementById('you_lose').style.display = 'none'

        } else {
          // Someone else has won.
          document.getElementById('you_lose').style.display = 'block'
          document.getElementById('you_win').style.display = 'none'
        }

      }
      let validScores = true;
      let highestScore = 0
      for(id in playerScores){
        if(playerScores[id]<=-1000) validScores = false;
        console.log(validScores)
      }
        // I am the master player and must report the results
      if (validScores && playerId === '0') {
        setTimeout(sendWinSignal(playerScores), 1000)
      }
      

      
    }
  })
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
  for(let i = 0; i<ranking.length; i++){
    points[i] = playerScores[ranking[i]];
  }

  let winReturn = {ranking, points};

  console.log("WIN RETURN:")
  console.log(winReturn)

  if (!gameEnded) {
    setTimeout(parent.postMessage({
      source: 'minigame',
      event: 'win',
      playerScores: winReturn,
    }, 'http://localhost:8081'), 2000)

    gameEnded = true
  }
}
