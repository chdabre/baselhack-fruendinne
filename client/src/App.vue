<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  })
}
</script>

<style lang="scss">
@font-face {
  font-family: 'PixelSplitter-Bold';
  font-style: normal;
  font-weight: normal;
  src: local('PixelSplitter-Bold'), url('./assets/PixelSplitter-Bold.woff') format('woff');
}

* {
  font-family: 'PixelSplitter-Bold', monospace;
}
</style>
