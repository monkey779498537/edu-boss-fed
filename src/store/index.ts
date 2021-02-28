import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 容器的状态实现了数据共享，在组件里面访问方便，但是没有持久化功能
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前用户状态  注意点：JSON.parse要求接收的是string,而localStorage返回的是string || null类型
  },
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 数据持久化，防止数据丢失
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
