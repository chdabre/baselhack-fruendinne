import { makeId } from './utils'
import * as _ from 'lodash'
import * as GameStates from './GameStates'
import Minigame from './Minigame'

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 10

export const BOARD_SIZE = 50

export const SPECIAL_TYPES = [
  'switch',
  'sendBack',
  'sendForward',
  'goForward',
  'goBack'
]

export default class GameSession {
  constructor () {
    this.id = makeId(4)
    this.state = new GameStates.StateWaitingForPlayers()
    this.settings = {}
    this.players = []
    this.playerTurn = 0
    this.board = this.createBoard()
    this.minigames = Minigame.loadGames()
  }

  createBoard () {
    const NUM_BASIC = 27
    const NUM_MINIGAMES = 15
    const NUM_SPECIAL = 8

    let board = []
    // Add Basic fields
    for (let i = 0; i < NUM_BASIC; i++) {
      board.push({
        type: 'basic'
      })
    }
    // Add MiniGame fields
    for (let j = 0; j < NUM_MINIGAMES; j++) {
      board.push({
        type: 'miniGame'
      })
    }
    // Add Special fields
    for (let k = 0; k < NUM_SPECIAL; k++) {
      board.push({
        type: 'special',
        special: _.sample(SPECIAL_TYPES)
      })
    }

    return _.shuffle(board)
  }

  startMinigame () {
    // the following line selects a random game:
    const minigame = _.sample(this.minigames)

    // for testing -> select a specific game -> work in progress
    // const minigame = this.minigames[this.minigames.length]

    // this.state = new GameStates.StateMinigame(minigame)
    this.state = new GameStates.StateMiniGame(minigame)
  }

  endMinigame (playerScores) {
    console.log(playerScores)
    Object.keys(playerScores).forEach(key => {
      this.players[key].score += playerScores[key]
    })

    this.state = new GameStates.StateGameIdle()
  }
}
