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
  backgroundColor: 0xffffff
});
document.body.appendChild(app.view);

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//load assets (images) into the local cache

//init loader and
const loader = PIXI.loader;

//load assets and on Complete run setup()
loader
  .add('click_here', 'assets/click_here.png')
  .add('fertig', 'assets/fertig.png')
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


function main() {
  mainExecuted = true

  let click_here = new PIXI.Sprite(loader.resources.click_here.texture)
  let fertig = new PIXI.Sprite(loader.resources.fertig.texture)
  var clickCount = 0;


  let text = new PIXI.Text(playerScores[playerId], {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center'
  });

  text.visible = false;

  // Set the initial position
  text.anchor.set(0.5);
  text.x = app.screen.width / 2;
  text.y = (app.screen.height / 2)-text.height*2;

  click_here.anchor.set(0.5);
  click_here.x = app.screen.width / 2;
  click_here.y = (app.screen.height / 2);

  fertig.anchor.set(0.5);
  fertig.x = app.screen.width / 2;
  fertig.y = (app.screen.height / 2) + fertig.height*2;


  
  // Opt-in to interactivity
  click_here.interactive = true;
  fertig.interactive = true;


  // Shows hand cursor
  click_here.buttonMode = true;
  fertig.buttonMode = true;


  click_here.on('pointerdown', () => {
    clickCount++;
  })

  fertig.on('pointerdown', () => {
    let diff = 100 - clickCount;
    console.log(playerScores)
    playerScores[playerId] = Math.abs(diff);
    updateClients();
  })

  app.stage.addChild(click_here)
  app.stage.addChild(fertig)
  app.stage.addChild(text)


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
    console.log(playerScores.keys)
    console.log(players)
    if (playerScores.length === players.length) {
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
