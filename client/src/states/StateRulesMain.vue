<template>
  <v-container>
    These are the Rules.

    <template v-if="playerId === 0">
      <v-btn
        block
        color="primary"
        @click="startGame"
      >Start Game</v-btn>
    </template>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'StateRulesMain',
  computed: {
    ...mapState([ 'session', 'playerId' ])
  },
  methods: {
    startGame () {
      this.$socket.emit('startGame', { sessionId: this.session.id })
    }
  }
}
</script>

<style scoped>

</style>
