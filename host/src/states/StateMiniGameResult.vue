<template>
  <div>
    <img
      id="bg"
      src="../assets/pixel.png"
    >
    <div class="logo-container">
      <h2>RESULTS</h2>
      <h1 class="name"></h1>

      <div class="results">
        <div
          v-for="(player, index) in ranking"
          :key="index"
          class="player"
        >
          <div class="player-name">{{ index + 1 }}</div>
          <img
            :src="`/dinos/${player.player.dino}.png`"
          >
          <div class="player-name">{{ player.player.name }}</div>
          <div class="player-points">{{ player.points }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'StateMiniGameResult',
  computed: {
    ...mapState([ 'session' ]),
    ranking () {
      const ranking = this.session.state.playerScores.ranking
      const points = this.session.state.playerScores.points
      return ranking.map(playerId => {
        return {
          player: this.session.players[playerId],
          points: points[playerId]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#bg {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.logo-container {
  display: flex;
  margin-top: 320px;
  width: 100%;
  flex-direction: column;
  align-items: center;

  .name {
    margin-top: 30px;
    font-size: 50px;
  }
  .results {
    font-family: 'ubuntu', sans-serif;
    font-size: 20px;

    width: 30%;

    .player {
      display: flex;
      flex-direction: row;
      align-items: center;

      height: 30px;
      img {
        display: block;
        width: 20px;
        height: 20px;
        margin-right: 10px;
        margin-left: 10px;
      }

      .player-points {
        flex: 1;
        text-align: right;
      }
    }
  }
}
</style>
