const params = new URLSearchParams(window.location.search)
const playerId = params.get('playerId')
const players = JSON.parse(params.get('players')) //array of all player
let readyPlayers = {};
let mainExecuted = false

let gameEnded = false
let playerScores = {}
let readyState = false; //true if all players are ready
playerScores[playerId] = 0



let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}



//Main game 
//Create a Pixi Application
const app = new PIXI.Application({
  height: innerHeight,
  width: innerWidth,
  antialias: true,
  backgroundColor: 0x212121
});
document.body.appendChild(app.view);

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//load assets (images) into the local cache

//init loader and
const loader = PIXI.loader;

//load assets and on Complete run setup()
loader
  .add('button', 'assets/flintstone.png')
  .load(setup)


//game setup function
function setup() {
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
            if(!mainExecuted) main();
        if (!readyState) {
            console.log("not all clients are ready!")
        }
        }
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


function main() {
  mainExecuted = true

  let text = new PIXI.Text(playerScores[playerId])
  let button = new PIXI.Sprite(loader.resources.button.texture)
  let button = new PIXI.Sprite
  button.interactive = true
  button.buttonMode = true


  button.on('pointerdown', () => {
    playerScores[playerId] += 10
    text.text = playerScores[playerId]
    updateClients()
  })

  app.stage.addChild(text)
  app.stage.addChild(button)


}


loader.on("complete", () => {
  console.log("loaded")

})


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
    if (playerScores[key] >= 100) {
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


function sendWinSignal(playerScores) {
  if (!gameEnded) {
    parent.postMessage({
      source: 'minigame',
      event: 'win',
      playerScores
    }, 'http://localhost:8081')

    gameEnded = true
  }
}
