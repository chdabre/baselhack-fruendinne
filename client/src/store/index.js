import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session: null,
    playerId: null
  },
  mutations: {
    setSession (state, item) {
      state.session = item
    },
    setPlayerId (state, item) {
      state.playerId = item
      localStorage.setItem(`playerId-${state.session.id}`, item)
    }
  },
  actions: {
  },
  modules: {
  }
})
