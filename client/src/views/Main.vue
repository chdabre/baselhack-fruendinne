<template>
  <v-container fluid>
    <NameForm v-if="session && playerId === null"/>

    <!-- Everybody's in Button -->
    <template v-if="session && session.state.name === 'StateWaitingForPlayers' && playerId === 0">
      <v-btn
        block
        color="primary"
        @click="playersReady"
      >Everyone's Ready</v-btn>
    </template>

    <!-- Rematch Button -->
    <template v-if="session && session.state.name === 'StateWin' && playerId === 0">
      <v-btn
        block
        color="primary"
        @click="rematch"
      >New Game</v-btn>
    </template>

    <!-- Minigame -->
    <Minigame
      v-if="session && session.state.name === 'StateMiniGame'"
      :game="session.state.game"
    ></Minigame>

    <!-- Generic State-Based Views -->
    <template v-if="session && StateComponents[session.state.name]">
      <component
        :is="StateComponents[session.state.name]"
      ></component>
    </template>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import NameForm from './NameForm'
import Minigame from './Minigame'

const StateComponents = {
  'StateRulesMain': () => import('../states/StateRulesMain.vue'),
  'StatePlayerTurn': () => import('../states/StatePlayerTurn.vue')
}

export default {
  name: 'main-game',
  components: { Minigame, NameForm },
  props: {
    id: String
  },
  data () {
    return {
      StateComponents
    }
  },
  computed: {
    ...mapState([ 'session', 'playerId' ])
  },
  created () {
    if (!this.session) {
      this.$socket.emit('requestSession', { id: this.id })
    }
  },
  methods: {
    playersReady () {
      this.$socket.emit('playersReady', { sessionId: this.id })
    },
    rematch () {
      this.$socket.emit('rematch', { sessionId: this.id })
    }
  },
  sockets: {
    SESSION_UPDATE (msg) {
      console.log('Session Update -> ' + msg.state.name)
      this.$store.commit('setSession', msg)
    },
    ERROR (msg) {
      console.log(msg)
    }
  }
}
</script>
