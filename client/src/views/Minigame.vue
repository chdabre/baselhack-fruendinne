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
    window.addEventListener('message', this.onMessage, false)
  },
  beforeDestroy () {
    window.removeEventListener('message', this.onMessage)
  },
  sockets: {
    MINIGAME (msg) {
      this.$refs.iframe.contentWindow.postMessage(msg, 'http://localhost:3000')
    }
  },
  methods: {
    onMessage (msg) {
      if (msg.data.source === 'minigame') {
        if (msg.data.event === 'win') {
          this.$socket.emit('winGame', {
            sessionId: this.$store.state.session.id,
            playerScores: msg.data.playerScores
          })
        } else {
          this.$socket.emit('MINIGAME', {
            sessionId: this.$store.state.session.id,
            msg: msg.data
          })
        }
      }
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
