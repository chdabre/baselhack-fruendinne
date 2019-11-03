<template>
  <div>
    <div class="logo-container">
      <h1>YOU WIN!</h1>
      <div class="player" >
        <img
          :src="`/dinos/${player.dino}.png`"
        >
        <div class="player-name">{{ player.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'StateRulesMain',
  computed: {
    ...mapState([ 'session' ]),
    player () {
      return this.session.state.winPlayer
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 60px;
  }
  .rules {
    margin-top: 40px;
  }

  .player {
    margin-top: 80px;
    text-align: center;
    .player-name {
      margin-top: 20px;
      font-size: 40px;
    }
  }
}
</style>
