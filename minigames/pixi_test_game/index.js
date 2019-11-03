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

PIXI.utils.sayHello(type)


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
  .add('flintstone', 'assets/flintstone.png')
  .load(setup);


//game setup function
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
        if(!mainExecuted) main();
        if (!readyState) {
            console.log("not all clients are ready!")
        }
      }
      testWin()
    }
  })


}


function main() {
    mainExecuted = true
    let sprite = new PIXI.Sprite(loader.resources.flintstone.texture)


    let text = new PIXI.Text(playerScores[playerId], {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    });
  
  
  
    // Set the initial position
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
  
  
    // Opt-in to interactivity
    sprite.interactive = true;
  
    // Shows hand cursor
    sprite.buttonMode = true;
  
    // Pointers normalize touch and mouse
    sprite.on('pointerdown', onClick)
  
    // Alternatively, use the mouse & touch events:
    // sprite.on('click', onClick); // mouse-only
    // sprite.on('tap', onClick); // touch-only
  
    app.stage.addChild(sprite);
    app.stage.addChild(text);
  
    //Do stuff every animation Frame FPS = 60 max
    app.ticker.minFPS = 30;
    app.ticker.maxFPS = 60;
    app.ticker.add(() => {
      sprite.angle += 1;
  
  
    })
  
  
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
      }, 'http://localhost:8081')
  
      console.log(players)
    }
}


loader.on("complete", () => {
  //send ready signal to other clients
  parent.postMessage({
    source: 'minigame',
    playerId,
    score: playerScores[playerId],
    ready: true,
  }, 'http://localhost:8081')

})


function testStart(data) {
  //console.log("testing ready")
  readyPlayers[data.playerId] = data.ready;
  for (player in readyPlayers) {
    if (!player) return false
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
