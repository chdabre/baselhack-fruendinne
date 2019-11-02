const minigamesFolder = './minigames/';
import fs from 'fs'

export default class Minigame {
  static loadGames () {
    let games = []

    fs.readdirSync(minigamesFolder).forEach(file => {
      const path = minigamesFolder + file
      const isDir = fs.lstatSync(path).isDirectory()

      if (isDir) {
        const configData = fs.readFileSync(path + '/minigame.json')
        const config = JSON.parse(configData)

        if (config.name) {
          games.push({
            ...config,
            path
          })
        }
      }
    })

    return games
  }
}
