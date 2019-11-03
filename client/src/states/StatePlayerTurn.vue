<template>
  <v-container>
    <template v-if="session.playerTurn === playerId">
      <div class="d-flex justify-center">
        <div class="dice-result">{{ dice }}</div>
      </div>
      <v-btn
        block
        color="primary"
        @click="rollDice"
      >Roll the Dice</v-btn>
    </template>
    <template v-else>
      Wait for your turn!
    </template>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'StatePlayerTurn',
  data () {
    return {
      dice: 0
    }
  },
  computed: {
    ...mapState([ 'session', 'playerId' ])
  },
  methods: {
    rollDice () {
      let diceRollInterval = setInterval(() => {
        this.dice = Math.round(-3 + Math.random() * 10)
      }, 50)

      setTimeout(() => {
        clearInterval(diceRollInterval)
        setTimeout(() => {
          this.$socket.emit('startMove', {
            sessionId: this.session.id,
            diceResult: this.dice
          })
        }, 1000)
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.dice-result {
  font-size: 100px;
}
</style>
