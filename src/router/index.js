import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


// 推荐页
const Recommend = () => import('components/recommend/recommend')
// 歌手页
const Singer = () => import('components/singer/singer')
// 排行页
const Rank = () => import('components/rank/rank')
// 搜索页
const Search = () => import('components/search/search')
// 歌手详情页
const SingerDetail = () => import('components/singer-detail/singer-detail')
// 推荐歌单页
const Disc = () => import('components/disc/disc')
// 最高排行页
const TopList = () => import('components/top-list/top-list')
// 用户中心
const UserCenter = () => import('components/user-center/user-center')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
