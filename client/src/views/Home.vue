<template>
  <v-container fluid>
    <h3 class="title mb-6">Join Game</h3>
    <v-text-field
      solo
      single-line
      label="Room Code"
      v-model="sessionIdInput"
      @keydown.enter="requestSession"
    ></v-text-field>

    <v-btn
      block
      color="primary"
      @click="requestSession"
    >Join Room</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      sessionIdInput: ''
    }
  },
  methods: {
    requestSession () {
      this.$socket.emit('requestSession', { id: this.sessionIdInput.trim().toUpperCase() })
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
