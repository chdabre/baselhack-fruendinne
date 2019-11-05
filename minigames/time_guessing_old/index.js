const params = new URLSearchParams(window.location.search)
const playerId = params.get('playerId')
const players = JSON.parse(params.get('players')) //array of all player
let readyPlayers = {};
let mainExecuted = false;

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
  .add('click_here', 'assets/click_here.png')
  .add('fertig', 'assets/fertig.png')
  .load(setup);


//game setup function
function setup() {
    //setup readyPlayers Object
    for(player in players) {
      readyPlayers[player] = false;

      // var START_DATE_2 = new Date(); // put in the starting date here
      // var INTERVAL_2 = 0.366; // in seconds
      // var INCREMENT_2 = 1; // increase per tick
      // var START_VALUE_2 = 738160; // initial value when it's the start date
      // var count_2 = 0;

      // window.addEventListener('load', function() {
        // var msInterval = INTERVAL_2 * 1000;
        // var now = new Date();
        // count_2 = parseInt((now - START_DATE_2) / msInterval) * INCREMENT_2 + START_VALUE_2;
        // document.getElementById('counter_2').innerHTML = count;
        // setInterval("count_2 += INCREMENT_2; document.getElementById('counter_2').innerHTML = count_2;", msInterval);
      // });
    }


  window.addEventListener('message', msg => {
    if (msg.data.source === 'minigame') {
      if (msg.data.playerId !== playerId) {
        playerScores[msg.data.playerId] = msg.data.score
      }
      if(testStart(msg.data)){
          readyState = true;
          if(!mainExecuted) main();
      }
      testWin()
    }
  })
}


loader.on("complete", () => {
  //send ready signal to other clients
  parent.postMessage({
    source: 'minigame',
    playerId,
    score: playerScores[playerId],
    ready: true,
  }, '*')

})

function main() {
  mainExecuted = true;

  let click_here = new PIXI.Sprite(loader.resources.click_here.texture)
  let fertig = new PIXI.Sprite(lodeaer.resources.fertig.texture)


  let text = new PIXI.Text(playerScores[playerId], {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center'
  });

  // Set the initial position
  click_here.anchor.set(0.5);
  click_here.x = app.screen.width / 2;
  click_here.y = app.screen.height / 2;

  fertig.anchor.set(0.5);
  fertig.x = app.screen.width / 2;
  fertig.y = app.screen.height / 2;


  // Opt-in to interactivity
  click_here.interactive = true;
  fertig.interactive = true;

  // Shows hand cursor
  click_here.buttonMode = true;
  fertig.buttonMode = true;

  // Pointers normalize touch and mouse
  click_here.on('pointerdown', onClick)
  //todo what happens when you start timer

  fertig.on('pointerdown', () => {
    let diff = 100 - clickCount;
    console.log(playerScores)
    playerScores[playerId] = Math.abs(diff);
    updateClients();
  });


  app.stage.addChild(click_here);
  app.stage.addChild(fertig);


  function onClick() {
    sprite.scale.x *= 1.25;
    sprite.scale.y *= 1.25;
    sprite.angle += 30;
    sprite.tint = Math.random() * 0xFFFFFF;

    //update score
    playerScores[playerId]++;
    text.text = playerScores[playerId]
    console.log(playerScores[playerId])

    parent.postMessage({
      source: 'minigame',
      playerId,
      score: playerScores[playerId],
    }, '*')

    console.log(players)

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

function testWin() {
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


function sendWinSignal(playerScores) {
  if (!gameEnded) {
    parent.postMessage({
      source: 'minigame',
      event: 'win',
      playerScores
    }, '*')

    gameEnded = true
  }
}
