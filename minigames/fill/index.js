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

console.log('innerWidth', ':', innerWidth);
console.log('innerHeight', ':', innerHeight);

const centerX = innerWidth / 2

app.renderer.backgroundColor = cWhite

// fixed triangle (0.0 is for transparent)
const triangle1 = new PIXI.Graphics
triangle1.beginFill(cWhite, 0.0)
triangle1.lineStyle(5, color1)
let width = 260
let height = 400
let posX = centerX - width / 2
let posY = 100
triangle1.drawPolygon([
  posX, posY,
  posX + width, posY,
  posX + (width / 2), posY + height
])
triangle1.endFill()
app.stage.addChild(triangle1)


const rect1 = new PIXI.Graphics
rect1.beginFill(cGray)
rect1.drawRect((innerWidth / 2) - 160, 576, 320, 133)
rect1.endFill()
app.stage.addChild(rect1)
rect1.interactive = true
rect1.buttonMode = true
rect1.on("pointerdown", onclick)


const step = 4
const startX = innerWidth / 2
let lineY = posY + height
let lineWidth = 0;
// noinspection JSSuspiciousNameCombination
const endX = posY
// noinspection JSSuspiciousNameCombination
const endY = posX

let counter = 0;

function onclick() {
  // just draw a line - simulating the growth of the triangle:
  const line = new PIXI.Graphics
  line.lineStyle(step, color1)
  lineWidth += width / 400 * step
  lineY -= step
  line.moveTo(startX - lineWidth / 2, lineY)
  line.lineTo(startX + lineWidth / 2, lineY)
  app.stage.addChild(line)





}
