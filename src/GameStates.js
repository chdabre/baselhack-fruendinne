import * as _ from 'lodash'
import { DINO_TYPES, MAX_PLAYERS, BOARD_SIZE, SPECIAL_TYPES } from './GameSession'

export class StateWaitingForPlayers {
  constructor (session) {
    this.name = this.constructor.name
    this.session = session

    this.dinos = _.shuffle(DINO_TYPES)
  }

  addPlayer (name) {
    if (this.session.players.length < MAX_PLAYERS) {
      const existingPlayer = _.find(this.session.players, player => player.name === name)
      if (!existingPlayer) {
        const index = this.session.players.push({
          name,
          score: 0,
          position: Math.floor(BOARD_SIZE / 2),
          dino: this.dinos.pop()
        })
        this.session.update()
        return index
      } else {
        throw 'NameAlreadyTaken'
      }
    } else {
      throw 'MaxPlayerCountExceeded'
    }
  }

  playersReady () {
    if (this.session.players.length >= 2) {
      this.session.setState(new StateRulesMain(this.session))
    } else {
      throw 'NotEnoughPlayers'
    }
  }
}

export class StateRulesMain {
  constructor (session) {
    this.name = this.constructor.name
    this.session = session
  }

  startGame () {
    //this.session.setState(new StatePlayerTurn(this.session))
    //this.session.playerTurn = 0
    const miniGame = _.sample(this.session.minigames)
    this.session.setState(new StateMiniGame(this.session, miniGame))
  }

}
export class StatePlayerTurn {
  constructor (session, increment) {
    this.name = this.constructor.name
    this.session = session

    if (increment) this.incrementPlayerTurn()
  }

  incrementPlayerTurn () {
    this.session.playerTurn += 1
    if (this.session.playerTurn > this.session.players.length - 1) this.session.playerTurn = 0
    this.session.update()
  }

  startMove (diceResult) {
    this.session.setState(new StateMove(this.session, diceResult))
    this.session.state.move()
  }
}
export class StateMove {
  constructor (session, numSteps) {
    this.name = this.constructor.name
    this.session = session
    this.numSteps = numSteps
  }

  move () {
    const playerTurn = this.session.playerTurn
    this.session.players[playerTurn].position += this.numSteps

    if (this.session.players[playerTurn].position < 0) { // Field before the start
      this.session.players[playerTurn].position = 0
    } else if (this.session.players[playerTurn].position >= BOARD_SIZE - 1) { // Win condition
      this.win()
    }

    const targetField = this.session.board[this.session.players[playerTurn].position]
    switch (targetField.type) {
      case 'basic':
        this.session.setState(new StatePlayerTurn(this.session, true))
        break
      case 'miniGame':
        this.startMiniGame()
        break
      case 'special':
        this.doSpecialAction(targetField)
        break
    }
  }

  startMiniGame () {
    //const miniGame = _.sample(this.session.minigames)
    const miniGame = _.find(this.session.minigames, { name: 'test-game' })
    this.session.setState(new StateMiniGame(this.session, miniGame))
  }

  doSpecialAction (field) {
    this.session.setState(new StateRulesSpecialField(this.session, field))
  }

  win () {
    this.session.setState(new StateWin(this.session))
  }
}
export class StateRulesSpecialField {
  constructor (session, field) {
    this.name = this.constructor.name
    this.session = session
    this.field = field
  }
}
export class StateMoveSpecialField {
  constructor (session) {
    this.name = this.constructor.name
    this.session = session
  }
}
export class StateMiniGame {
  constructor (session, game) {
    this.name = this.constructor.name
    this.session = session
    this.game = game

    this.game.url = `/minigame/${this.game.name}/index.html`
    if (process.env.NODE_ENV !== 'production' ) this.game.url = 'http://localhost:3000' + this.game.url
  }

  endMinigame (playerScores) {
    const points = playerScores.points
    for (let i = 0; i < this.session.players.length; i++) {
      this.session.players[i].score += points[i]
    }

    this.session.setState(new StateMiniGameResult(this.session, playerScores))
    this.session.state.moveMiniGame()
  }
}
export class StateMiniGameResult {
  constructor (session, playerScores) {
    this.name = this.constructor.name
    this.session = session
    this.playerScores = playerScores
  }

  moveMiniGame () {
    this.session.setState(new StateMoveMiniGame(this.session, this.playerScores))
    this.session.state.move()
  }
}
export class StateMoveMiniGame {
  constructor (session, playerScores) {
    this.name = this.constructor.name
    this.session = session
    this.playerScores = playerScores
  }

  move () {
    const ranking = this.playerScores.ranking
    for (let i = 0; i < ranking.length; i++) {
      // How much does each player move
      this.session.players[parseInt(ranking[i])].position += (ranking.length / 2) - i

      if (this.session.players[i].position < 0) { // Field before the start
        this.session.players[i].position = 0
      } else if (this.session.players[i].position >= BOARD_SIZE - 1) { // Win condition
        this.win()
      }
    }
    this.session.setState(new StatePlayerTurn(this.session, true))
  }

  win () {
    this.session.setState(new StateWin(this.session))
  }
}
export class StateWin {
  constructor (session) {
    this.name = this.constructor.name
    this.session = session
  }

  rematch () {
    this.session.setState(new StateRulesMain(this.session))
  }
}
