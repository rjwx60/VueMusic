<template>
  <div class="music-list">
    <!-- 回退 -->
    <div class="back" @click="back"><i class="icon-back"></i></div>
    <!-- 标题 -->
    <h1 class="title" v-html="title"></h1>

    <!-- 封面背景 -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <!-- 随机播放按钮 -->
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>

    <div class="bg-layer" ref="layer"></div>

    <!-- 列表 -->
    <scroll :data="songs" @scroll="scroll" :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper">
        <!-- 列表项 -->
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container"><loading></loading></div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  // 滚动组件
  import Scroll from 'base/scroll/scroll'
  // 友好提示
  import Loading from 'base/loading/loading'
  // 通用组件
  import SongList from 'base/song-list/song-list'
  // 工具函数
  import {prefixStyle} from 'common/js/dom'
  import {playlistMixin} from 'common/js/mixin'
  const backdrop = prefixStyle('backdrop-filter')
  const transform = prefixStyle('transform')
  // Vuex
  import {mapActions} from 'vuex'
  // 常量
  const RESERVED_HEIGHT = 40

  export default {
    mixins: [playlistMixin],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    computed: {
      // return bgStyle
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      // 处理底部
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 闭包获取滚动数值
      scroll(pos) {
        this.scrollY = pos.y
      },
      // 回退
      back() {
        this.$router.back()
      },
      // 选择则触发方法 - vuex
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      // 触发随机播放方法 - vuex
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      // 触发方法
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      // 下拉放大效果
      // 核心: 根据下拉值转化 scale - translate3d transform 和限定值 minTransalteY
      scrollY(newVal) {
        let translateY = Math.max(this.minTransalteY, newVal)
        let scale = 1
        let zIndex = 0
        let blur = 0
        const percent = Math.abs(newVal / this.imageHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }

        // 上移则跟随(睡鼠标)上移
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`

        // 实现下拉效果
        if (newVal < this.minTransalteY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    components: {
      Scroll,
      Loading,
      SongList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
