<template>
  <div
    class="main-container"
  >
    <div class="board-container">
      <PlayingFieldSquare
        v-for="(field, index) in board"
        :key="index"
        :index="index"
        :field="field"
      ></PlayingFieldSquare>
      <img alt="bg" class="background" src="../assets/fields.png">
      <img alt="bg" class="foreground" src="../assets/foreground.png">
    </div>
  </div>
</template>

<script>
import PlayingFieldSquare from './PlayingFieldSquare'

export default {
  name: 'PlayingField',
  props: {
    board: Array
  },
  components: {
    PlayingFieldSquare
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  position: fixed;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../assets/background.png");

  .board-container {
    position: relative;
    height: 100%;
    .background {
      height: 100%;
    }
    .foreground {
      position: absolute;
      left: 0;
      height: 100%;
      z-index: 100;
    }
  }
}
</style>
