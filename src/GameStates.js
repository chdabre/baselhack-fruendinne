export class StateWaitingForPlayers {
  constructor () {
    this.name = this.constructor.name
  }
}

export class StateRulesMain {
  constructor () {
    this.name = this.constructor.name
  }
}
export class StatePlayerTurn {
  constructor () {
    this.name = this.constructor.name
  }
}
export class StateMove {
  constructor () {
    this.name = this.constructor.name
  }
}
export class StateRulesSpecialField {
  constructor () {
    this.name = this.constructor.name
  }
}
export class StateMoveSpecialField {
  constructor () {
    this.name = this.constructor.name
  }
}
export class StateMiniGame {
  constructor (game) {
    this.name = this.constructor.name
    this.game = game

    this.game.url = `http://localhost:3000/minigame/${this.game.name}/index.html`
  }
}
export class StateMiniGameResult {
  constructor () {
    this.name = this.constructor.name
  }
}
export class StateMoveMiniGame {
  constructor () {
    this.name = this.constructor.name
  }
}


