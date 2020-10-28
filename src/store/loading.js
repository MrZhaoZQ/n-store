import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({})

store.registerModule('loading', { // 名字自己定义
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, pageload) {
      state.isLoading = pageload.isLoading
    },
    axiosStart (state) {
      state.isLoading = true
    },
    axiosEnd (state) {
      state.isLoading = false
    }
  },
  getter : {
    ajaxIsLoading: state => state.ajaxIsLoading
  }
})

export default store;