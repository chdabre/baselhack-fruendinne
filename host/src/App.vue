<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: 'PixelSplitter-Bold';
  font-style: normal;
  font-weight: normal;
  src: local('PixelSplitter-Bold'), url('./assets/PixelSplitter-Bold.woff') format('woff');
}

* {
  font-family: 'PixelSplitter-Bold', monospace;
  margin: 0;
  padding: 0;
}
</style>
