<template>
  <div
    class="playing-field-square"
    :style="offsetStyle"
    :class="{ minigame: field.type === 'miniGame' }"
  >
    <img
      class="dino"
      v-for="(dino, index) in dinos"
      :key="index"
      :src="'/dinos/' + dino + '.png'"
      :style="dinoTilt(index)"
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PlayingFieldDino',
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
      const OFFSET_Y = 2
      const INTERVAL_X = 8.6
      const INTERVAL_Y = 14

      return {
        bottom: OFFSET_Y + (this.location[0] * INTERVAL_Y) + '%',
        left: OFFSET_X + (this.location[1] * INTERVAL_X) + '%'
      }
    }
  },
  methods: {
    dinoTilt () {
      let styleClass = `transform: rotate(${Math.random() * 20 - 10}deg)`
      if (this.location[0] % 2 !== 0) styleClass += ` scaleX(-1);`

      return styleClass
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
    width: 8.6%;
    height: 14%;

    .dino {
      position: absolute;
      height: 70%;
    }

    &.minigame {
      box-shadow: inset 0 0 20px red;
    }
  }
</style>
