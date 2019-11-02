export class StateWaitingForPlayers {
  constructor () {
    this.name = this.constructor.name
  }
}

export class StateGameIdle {
  constructor () {
    this.name = this.constructor.name
  }
}

export class StateMinigame {
  constructor (game) {
    this.name = this.constructor.name
    this.game = game

    this.game.url = `http://localhost:3000/minigame/${this.game.name}/index.html`
  }
}
