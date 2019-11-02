<template>
  <div class="home">
    <button
      @click="requestSession"
    >New Game</button>
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
    SESSION (msg) {
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
