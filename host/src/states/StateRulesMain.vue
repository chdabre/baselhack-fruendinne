<template>
  <div>
    <div class="logo-container">
      <h1>HOW TO PLAY</h1>

      <p class="rules">
        Help your dinosaur reach the rooftop first!<br>
        When it’s your turn, roll the dice. Your dino will run right ahead (or maybe backwards).<br>
        Some Fields might launch you right into a MiniGame where you can help your dino get an extra boost.<br>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'StateRulesMain',
  computed: {
    ...mapState([ 'session' ])
  }
}
</script>

<style lang="scss" scoped>
.logo-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;

  .rules {
    margin-top: 40px;
  }
}
</style>
