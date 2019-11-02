<template>
  <div>
    Main
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'main-game',
  props: {
    id: String
  },
  computed: {
    ...mapState([ 'session' ])
  },
  created () {
    if (!this.session) {
      this.$socket.emit('requestSession', { id: this.id })
    }
  },
  sockets: {
    SESSION (msg) {
      this.$store.commit('setSession', msg)
    },
    ERROR (msg) {
      console.log(msg)
    }
  }
}
</script>

<style scoped>

</style>
