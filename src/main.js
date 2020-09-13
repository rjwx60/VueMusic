import 'babel-polyfill'

// 将 MessageChannel 与 setImmediate 禁用
// 以避免升级 vue2.5x+ 后导致的问题
// 详看: https://juejin.im/post/6844903516822044680
import 'common/js/hack'

import Vue from 'vue'
import App from './App'

// 三方插件
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

// vue vue-router
import router from './router'

// vue vuex
import store from './store'
import { SET_PLAY_HISTORY, SET_FAVORITE_LIST } from './store/mutation-types'

// utils
import { loadPlay, loadFavorite } from 'common/js/cache'
import { processSongsUrl } from 'common/js/song'

// vue-rx & rxjs
import VueRx from 'vue-rx';
import { subscriptions } from './observer';

// css style
import 'common/stylus/index.styl'

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'

// 速度优化插件
fastclick.attach(document.body)

// Vue-Rxjs 插件
Vue.use(VueRx);

// 懒加载插件
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

// 获取本地缓存 - songs
const historySongs = loadPlay()
processSongsUrl(historySongs).then((songs) => {
  // 状态管理
  store.commit(SET_PLAY_HISTORY, songs)
})

// 获取本地缓存 - favorite
const favoriteSongs = loadFavorite()
processSongsUrl(favoriteSongs).then((songs) => {
  // 状态管理
  store.commit(SET_FAVORITE_LIST, songs)
})

// 初始化
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  subscriptions,
  // subscriptions: {
  //   msg: new Subject()
  // },
  render: h => h(App)
})
