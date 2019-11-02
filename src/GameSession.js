import { makeId } from './utils'

export default class GameSession {
  constructor () {
    this.id = makeId(4)

    this.state = {

    }

    this.settings = {

    }
    this.players = []
  }
}
