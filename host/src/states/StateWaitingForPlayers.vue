<template>
  <div>
    <div class="logo-container">
      <h1>JOIN THE GAME</h1>
      <span class="url">{{ url }}</span>
      <span class="room-code">{{ session.id }}</span>
    </div>
    <div class="players">
      <div class="players-group">
        <div
          v-for="(player, index) in session.players"
          :key="index"
          class="player"
        >
          <img
            :src="`/dinos/${player.dino}.png`"
          >
          <div class="player-name">{{ player.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'StateWaitingForPlayers',
  computed: {
    ...mapState([ 'session' ]),
    url () {
      return window.location.origin
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

  img {
    width: 200px;
  }

  .url {
    margin-top: 20px;
    font-family: 'ubuntu', sans-serif;
    font-weight: bold;
  }
  .room-code {
    margin-top: 30px;
    font-size: 60px;
  }
}

.players {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 50px;

  .players-group {
    display: flex;
    .player {

      &:not(:last-child) {
        margin-right: 50px;
      }
      img {
        height: 100px;
      }
      .player-name {
        text-align: center;
      }
    }
  }
}
</style>
