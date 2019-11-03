<template>
  <div>
    <img
      src="../assets/pixel.png"
    >
    <div class="logo-container">
      <h2>MINIGAME</h2>
      <h1 class="name">{{ session.state.game.displayName }}</h1>

      <p class="rules">
        {{ session.state.game.description }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'StateMiniGame',
  computed: {
    ...mapState([ 'session' ])
  }
}
</script>

<style lang="scss" scoped>
img {
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
  .rules {
    font-family: 'ubuntu', sans-serif;
    margin-top: 40px;
    font-size: 26px;

    max-width: 40%;
    text-align: center;
  }
}
</style>
