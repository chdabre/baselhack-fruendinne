import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
import vuetify from './plugins/vuetify'

Vue.use(new VueSocketIO({
  debug: true,
  connection: typeof webpackHotUpdate !== 'undefined' ? `http://localhost:3000` : `http://${window.location.host}`,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
