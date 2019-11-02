let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

PIXI.utils.sayHello(type);

// with specific dimensions:
let app = new PIXI.Application({
  width: innerWidth,
  height: innerHeight,
  antialias: true
});

// fullscreen:
// let app = new PIXI.Application(innerWidth, innerHeight);

// add the canvas of fill to the body
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0xececec;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;


// loading pictures

PIXI.loader
  .add("assets/icon1.png")
  .load(setup);

let number = 0;

function setup() {
  let text = new PIXI.Text(
    number, {fontSize: 48}
  );

  app.stage.addChild(text);
  let icon1 = new PIXI.Sprite(
    PIXI.loader.resources["assets/icon1.png"].texture);
  icon1.pivot.set(0.5);
  icon1.interactive = true;
  icon1.buttonMode = true;
  icon1.anchor.set(0.5);
  // icon1.pivot.set(0.5);
  icon1.x = icon1.width / 2;
  icon1.y = icon1.height / 2;
  app.ticker.add(() => icon1.angle += 1);
  app.stage.addChild(icon1);

  icon1.on("pointerdown", onclick);

  function onclick() {
    text.text = ++number;
    console.log(number);
  }

}

