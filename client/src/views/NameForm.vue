<template>
  <v-form>
    <span class="body-1">Please enter your name.</span>
    <v-text-field
      label="Name"
      v-model="nameInput"
    ></v-text-field>
    <v-btn
      block
      color="primary"
      @click="joinGame"
    >Join Game</v-btn>
  </v-form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NameForm',
  data () {
    return {
      nameInput: ''
    }
  },
  computed: {
    ...mapState([ 'session' ])
  },
  created () {
    const oldPlayerId = localStorage.getItem(`playerId-${this.session.id}`)
    if (oldPlayerId) this.$store.commit('setPlayerId', parseInt(oldPlayerId))
  },
  methods: {
    joinGame () {
      if (this.nameInput.trim()) {
        this.$socket.emit('joinGame', {
          sessionId: this.session.id,
          name: this.nameInput.trim()
        })
      }
    }
  },
  sockets: {
    PLAYER (msg) {
      this.$store.commit('setPlayerId', msg)
    }
  }
}
</script>
