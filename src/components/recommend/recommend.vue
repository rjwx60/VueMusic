<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>

        <!-- 轮播图，但图源失效 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <div class="slider-content">
            <slider ref="slider">
              <div v-for="(item, index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>

        <!-- 推荐列表主体 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item, index) in discList" :key=index class="item">
              <div class="icon">
                <!-- v-lazy 懒加载 -->
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <!-- v-html -->
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 友好提示组件 -->
      <div class="loading-container" v-show="!discList.length">
        <loading :title="loadingText"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  // 轮播
  import Slider from 'base/slider/slider'
  // 加载
  import Loading from 'base/loading/loading'
  // 包裹
  import Scroll from 'base/scroll/scroll'
  // 请求
  import {getRecommend, getDiscList} from 'api/recommend'
  // Mixin + Vuex
  import {playlistMixin} from 'common/js/mixin'
  // 静态方法
  import {ERR_OK} from 'api/config'
  // Vuex
  import {mapMutations} from 'vuex'

  export default {
    // mixins 将多个组件均用到的方法抽离
    // 此处是将多个组件用到的监听 playlist 方法抽离集中到 mixin 并用 vuex 管理
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: [],
        loadingText: "Just wait!!"
      }
    },
    // 生命周期驱动
    created() {
      // 获取推荐列表
      this._getRecommend()
      // 获取推荐的歌单列表
      this._getDiscList()
    },
    activated() {
      setTimeout(() => {
        // 生命周期驱动更新视图
        this.$refs.slider && this.$refs.slider.refresh()
      }, 20)
    },
    methods: {
      // 根据 playlist 的有无定义底部栏
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      // @load="loadImage" 当 src 有值时才开始加载，onload 事件则是在加载完毕后触发，触发更新视图
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
        }
      },
      // 选中跳转
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        // vuex mutations 触发
        this.setDisc(item)
      },
      // 数据获取1
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      // 数据获取2
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      // vuex
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Loading,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
