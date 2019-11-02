<template>
  <v-container fluid>
    <NameForm v-if="session && playerId === null"/>

    <!-- Everybody's in Button -->
    <template v-if="session && session.state.name === 'StateWaitingForPlayers' && playerId === 0">
      <v-btn
        block
        color="primary"
        @click="startGame"
      >Start Game</v-btn>
    </template>

    <!-- Minigame -->
    <Minigame
      v-if="session && session.state.name === 'StateMinigame'"
      :game="session.state.game"
    ></Minigame>

    <!-- Idle -->
    <div
      v-if="session && session.state.name === 'StateGameIdle'"
    >
      {{ session.players }}
      <v-btn
        block
        color="primary"
        @click="startGame"
      >New Minigame</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import NameForm from './NameForm'
import Minigame from './Minigame'

export default {
  name: 'main-game',
  components: { Minigame, NameForm },
  props: {
    id: String
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
    startGame () {
      this.$socket.emit('startGame', { sessionId: this.id })
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
