<template>
  <div>
    <!-- Generic State-Based Views -->
    <template v-if="session && StateComponents[session.state.name]">
      <component
        :is="StateComponents[session.state.name]"
      ></component>
    </template>
    <PlayingField
      v-else-if="session"
      :board="session.board"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlayingField from '../components/PlayingField'

const StateComponents = {
  'StateWaitingForPlayers': () => import('../states/StateWaitingForPlayers.vue')
}

export default {
  name: 'main-game',
  components: { PlayingField },
  props: {
    id: String
  },
  data () {
    return {
      StateComponents
    }
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
    SESSION_UPDATE (msg) {
      this.$store.commit('setSession', msg)
    },
    ERROR (msg) {
      console.log(msg)
    }
  }
}
</script>
