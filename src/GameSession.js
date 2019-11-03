import { makeId } from './utils'
import * as _ from 'lodash'
import * as GameStates from './GameStates'
import Minigame from './Minigame'
import { EventEmitter } from 'events'

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

export const DINO_TYPES = [
  'norbert',
  'lennard',
  'britney',
  'melvin',
  'kevin',
  'laurie',
  'martha',
  'drphil',
  'gilbert',
  'rita'
]

export default class GameSession extends EventEmitter {
  constructor () {
    super()

    this.id = makeId(4)
    this.state = new GameStates.StateWaitingForPlayers(this)
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

  setState(state) {
    this.state = state
    this.update()
  }

  update() {
    this.emit('update', this.toObject())
  }

  toObject() {
    return {
      id: this.id,
      state: {
        name: this.state.name,
        game: this.state.game || null,
        field: this.state.field || null
      },
      settings: this.settings,
      players: this.players,
      playerTurn: this.playerTurn,
      board: this.board,
      minigames: this.minigames,
    }
  }
}
