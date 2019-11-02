<template>
  <iframe
    id="minigame_frame"
    ref="iframe"
    :src="iframeUrl"
  ></iframe>
</template>

<script>
export default {
  name: 'minigame',
  props: {
    game: Object
  },
  computed: {
    iframeUrl () {
      return this.game.url + '?playerId=' + this.$store.state.playerId
    }
  },
  created () {
    window.addEventListener('message', msg => {
      if (msg.data.source === 'minigame') {
        this.$socket.emit('MINIGAME', {
          sessionId: this.$store.state.session.id,
          msg: msg.data
        })
      }
    }, false)
  },
  sockets: {
    MINIGAME (msg) {
      this.$refs.iframe.contentWindow.postMessage(msg, 'http://localhost:3000')
    }
  }
}
</script>

<style scoped>
#minigame_frame {
  position: fixed;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
