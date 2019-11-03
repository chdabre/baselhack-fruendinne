<template>
  <div>
    <div class="logo-container">
      <h1>HOW TO PLAY</h1>

      <p class="rules">
        Rüdisulü
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
