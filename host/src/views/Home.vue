<template>
  <div class="home">
    <div class="logo-container">
      <img
        src="../assets/logo.png"
      >
    </div>
    <div class="button-container">
      <button
        @click="requestSession"
      >New Game</button>
      <button
        @click="$router.push('/client')"
      >Join Game</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    requestSession () {
      this.$socket.emit('requestSession')
    }
  },
  sockets: {
    SESSION_UPDATE (msg) {
      this.$store.commit('setSession', msg)
      this.$router.push({
        name: 'main',
        params: {
          id: msg.id
        }
      })
    },
    ERROR (msg) {
      console.log(msg)
    }
  }
}
</script>

<style lang="scss">
.logo-container {
  width: 100%;
  display: flex;
  justify-content: center;

  margin-top: 50px;

  img {
    width: 250px;
  }
}

.button-container {
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;

  button {
    margin-top: 20px;
    width: 300px;
    height: 75px;
    font-size: 2rem;
    background-color: lightgray;
    border: none;
  }
}
</style>
