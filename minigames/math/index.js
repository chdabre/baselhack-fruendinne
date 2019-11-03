const params = new URLSearchParams(window.location.search)
const playerId = params.get('playerId')
const players = JSON.parse(params.get('players')) //array of all player
let readyPlayers = {};

let gameEnded = false
let playerScores = {}
let playerResult = {}
var num = new Array(4);
var ops = new Array(4)
let calcResult = 0
var counter = 0;
let mainExecuted = false;
let readyState = false; //true if all players are ready
playerScores[playerId] = 0
playerResult[playerId] = 0


//Create HTML

let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

getCalculation();
setup();

//game setup function
function setup() {

  //setup readyPlayers Object
  for (player in players) {
    readyPlayers[player] = false;
  }


  
  console.log(num)

  // Event Listener
  window.addEventListener('message', msg => {
    if (msg.data.source === 'minigame') {
      if (msg.data.playerId !== playerId) {
        playerScores[msg.data.playerId] = msg.data.score;
        num[0] = msg.data.num1;
        num[1] = msg.data.num2;
        num[2] = msg.data.num3;
        num[3] = msg.data.num4;
        ops[0] = " ";
        ops[1] = msg.data.ops1;
        ops[2] = msg.data.ops2;
        ops[3] = msg.data.ops3;
        calcResult = msg.data.result;
      }
      if (testStart(msg.data)) {
        readyState = true;
        console.log("all ready")
        if (!mainExecuted) main();
        if (!readyState) {
          console.log("not all clients are ready!")
        }
      }
      console.log("player scores: " + playerScores)
      testWin()
    }
  })




} /*******************************************************************************END SETUP*/



function main() {
  mainExecuted = true;

  console.log("main exec")
  //Main game
  //Create a Pixi Application
  const app = new PIXI.Application({
    height: innerHeight,
    width: innerWidth,
    antialias: true,
    backgroundColor: 0xffffff
  });
  document.body.appendChild(app.view);

  // Scale mode for all textures, will retain pixelation
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  //load assets (images) into the local cache


  //text displayed on screen
  let text = new PIXI.Text("START", {
    fontFamily: 'Arial',
    fontSize: 50,
    fill: 0x000000,
    align: 'center'
  });
  text.y = (app.screen.height / 2)-text.height


  text.x = (app.screen.width / 2)-text.width/2;

  //Opt-in to int
  text.interactive = true;
  text.buttonMode = true;
  text.on('pointerdown', onClick)

  app.stage.addChild(text)



  //ONClick Function
  function onClick() {
    if (counter <= 3) {
      text.text = ops[counter] + " " + num[counter];
      counter++;
    } else if (counter == 4) {
      text.text = ""
      document.getElementById('numInput').style.display = 'block'
    }
    text.x = (app.screen.width / 2)-text.width/2;


    parent.postMessage({
      source: 'minigame',
      playerId,
      score: playerScores[playerId],
    }, 'http://localhost:8081')

    console.log("players" + players)
  }



}




function testStart(data) {
  //console.log("testing ready")
  readyPlayers[data.playerId] = data.ready;
  for (player in readyPlayers) {
    if (!player) return false
  }

  console.log()
  return num[0]!=null
}


function testWin() {
  Object.keys(playerResult).forEach(key => {
    console.log("my input " + playerResult[key])
    console.log("calcResult: " + calcResult)
    if(gameEnded){
      // Someone has won.
      if (key === playerId) {
        if (playerResult[key] == calcResult) {
        // I have won.
        console.log("WON!")
        document.getElementById('you_win').style.display = 'block'

        }
        else {
          console.log("LOST!")
          // Someone else has won.
          document.getElementById('you_lose').style.display = 'block'
        }

        
      }
      // I am the master player and must report the results
      if (playerId === '0') {
        setTimeout(() => {
          sendWinSignal(playerScores)
        }, 3000)
      }
    }
  })
}


function sendWinSignal(playerScores) {
    parent.postMessage({
      source: 'minigame',
      event: 'win',
      playerScores
    }, 'http://localhost:8081')


}


//document.getElementById("numInput").onsubmit = function(e){
  
document.getElementById("numInput").addEventListener("submit", (e) => {
  e.preventDefault();
  let inputNumber = document.getElementById("forminput").value;

  gameEnded = true;

  playerResult[playerId] = inputNumber;

  document.getElementById("numInput").style.display = "none"
  //text.text = "Your input is: " + inputNumber + "/n waiting for other players"

  parent.postMessage({
    source: 'minigame',
    playerId,
    score: playerScores[playerId],
    inputNumber: playerResult[playerId],
  }, 'http://localhost:8081')
})










function getCalculation() {
  //Create Variabels numbers and send it to others
  console.log("entered calc")
  if (playerId == "0") {
    console.log("player 0")
    let operations = ['+', '-', '*'];
    num[0] = Math.floor(Math.random() * 20 + 1);
    num[1] = Math.floor(Math.random() * 20 + 1);
    num[2] = Math.floor(Math.random() * 20 + 1);
    num[3] = Math.floor(Math.random() * 20 + 1);
    ops[0] = " ";
    ops[1] = operations[Math.floor(Math.random() * Math.floor(3))];
    ops[2] = operations[Math.floor(Math.random() * Math.floor(3))];
    ops[3] = operations[Math.floor(Math.random() * Math.floor(3))];

    let calc = "(" + "(" + num[0] + ops[1] + num[1] + ")" + ops[2] + num[2] + ")" + ops[3] + num[3];
    calcResult = eval(calc);
    console.log(calc.toString() + " =" + calcResult);



    parent.postMessage({
      source: 'minigame',
      playerId,
      score: playerScores[playerId],
      num1: num[0],
      num2: num[1],
      num3: num[2],
      num4: num[3],
      ops1: ops[1],
      ops2: ops[2],
      ops3: ops[3],
      result: calcResult,
    }, 'http://localhost:8081')

  }
}
