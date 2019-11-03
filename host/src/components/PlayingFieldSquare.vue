<template>
  <div
    class="playing-field-square"
    :style="offsetStyle"
  >
    <img
      class="dino"
      v-for="(dino, index) in dinos"
      :key="index"
      :src="'/dinos/' + dino + '.png'"
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PlayingFieldSquare',
  props: {
    field: Object,
    index: Number
  },
  data () {
    return {
      location: [0, 0]
    }
  },
  created () {
    const row = Math.floor(this.index / 10)
    const col = (row % 2 === 0) ? this.index % 10 : 9 - this.index % 10
    this.location = [row, col]
  },
  computed: {
    ...mapState([ 'session' ]),
    dinos () {
      return this.session.players.filter(p => p.position === this.index).map(player => player.dino)
    },
    offsetStyle () {
      const OFFSET_X = 7
      const OFFSET_Y = 4
      const INTERVAL_X = 8.5
      const INTERVAL_Y = 14

      return {
        bottom: OFFSET_Y + (this.location[0] * INTERVAL_Y) + '%',
        left: OFFSET_X + (this.location[1] * INTERVAL_X) + '%'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.playing-field-square {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 9%;
  height: 11%;

  .dino {
    position: absolute;
    height: 70%;
  }
}
</style>
