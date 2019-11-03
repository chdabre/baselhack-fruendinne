// minigame "fill"
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

PIXI.utils.sayHello(type)

let app = new PIXI.Application({
    width: innerWidth,
    height: innerHeight,
    antialias: true
  }
)

document.body.appendChild(app.view)

const color1 = 0x95CDB8
const cBlack = 0x000000
const cWhite = 0xffffff
const cGray = 0xC5C5C5

app.renderer.backgroundColor = cWhite

// fixed triangle (0.0 is for transparent)
const triangle1 = new PIXI.Graphics
triangle1.beginFill(cWhite, 0.0)
triangle1.lineStyle(5, color1)
let posX = 75
let posY = 131
let width = 264
let height = 400
triangle1.drawPolygon([
  posX, posY,
  posX + width, posY,
  posX + (width / 2), posY + height
])
triangle1.endFill()
app.stage.addChild(triangle1)


const triangle2 = new PIXI.Graphics
triangle2.beginFill(color1)
triangle2.lineStyle(5, color1)
let posX2 = posX + (width / 2)
let posY2 = posY + height
let width2 = 3
let height2 = 3

triangle2.drawPolygon([
  posX2, posY2,
  posX2 + width2, posY2,
  posX2 + (width2 / 2), posY2 + height2
])
triangle2.endFill()
app.stage.addChild(triangle2)


const rect1 = new PIXI.Graphics
rect1.beginFill(cGray)
rect1.drawRect(39, 576, 336, 133)
rect1.endFill()
app.stage.addChild(rect1)
rect1.interactive = true
rect1.buttonMode = true
rect1.on("pointerdown", onclick)


const step = 3

function onclick() {
  posX2 -= step
  posY2 -= step
  width2 += step
  height2 += step
  triangle2.drawPolygon(
    posX2, posY2,
    posX2 + width2, posY2,
    posX2 + (width2 / 2), posY2 + height2
  )
}
