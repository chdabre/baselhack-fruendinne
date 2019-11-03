<template>
  <div>
    <PlayingField
      v-if="session"
      :board="session.board"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlayingField from '../components/PlayingField'

export default {
  name: 'main-game',
  components: { PlayingField },
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
