const button = document.getElementById('btn')


//Neu
const displayText = document.getElementById('dispText')
// const buttonT = document.getElementById('btnTime')
var startTime;
var stopTime;
var diffTime;
var tempScore


const params = new URLSearchParams(window.location.search)
const playerId = params.get('playerId')

let gameEnded = false
let playerScores = {}
playerScores[playerId] = 0

//neu
let readyPlayers = {}
let mainExecuted = false;

//neu
let readyState = false;


// button.addEventListener('click', event => {
//   playerScores[playerId]++
//   gameEl.innerText = playerScores[playerId]
//
//   parent.postMessage({
//     source: 'minigame',
//     playerId,
//     score: playerScores[playerId]
//   }, 'http://localhost:8081')
// })


//Neu
button.addEventListener('click', event => {

  button.style.visibility = 'hidden';
  //Neu
  stopTime = new Date().getTime()
  diffTime = stopTime - startTime

  tempScore = Math.abs(60000 - diffTime)


  playerScores[playerId]=(180000-tempScore);

    console.log("tempScore = " + tempScore)


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

function testStart(data){
  //console.log("testing ready")
  readyPlayers[data.playerId] = data.ready;
  for(player in readyPlayers){
    if(!player) return false
  }
  return true
}

setup();

function setup(){

  //for testing because there are no ready players. needs to be moved to the end of setup later
  main()

  //setup readyPlayers Object
  for(player in players){
    readyPlayers[player] = false;
  }

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


function main(){
  //mainExecuted = true;
  startTime = new Date().getTime();


  button.style.visibility = 'hidden';
  displayText.innerText = "3"

  setTimeout(function(){
    displayText.innerText = "2"
  }, 2000);

  setTimeout(function(){
    displayText.innerText = "1"
  }, 3000);

  setTimeout(function(){
    displayText.innerText = "GO!"
  }, 4000);

  setTimeout(function(){
    displayText.innerText = ""
    button.style.visibility = 'visible';
  }, 4800);


  setTimeout(function(){
    displayText.innerText = "END"
  }, 180000);

}





