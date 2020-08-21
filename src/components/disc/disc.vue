<template>
  <!-- 过渡效果封装 -->
  <transition name="slide">
    <!-- 获取的内容交由子级处理 -->
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  // 列表展示组件
  import MusicList from 'components/music-list/music-list'
  // 数据获取
  import { getSongList } from 'api/recommend'
  // 静态文件
  import { ERR_OK } from 'api/config'
  // Vuex
  import { mapGetters } from 'vuex'
  // 工具函数
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

  export default {
    computed: {
      // vuex get
      title() {
        return this.disc.dissname
      },
      // vuex get
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    // 生命周期驱动
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        // 错误返回上一页
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        // 否则获取数据
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            // 拼接数据2
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          // 校验是否合法
          if (isValidMusic(musicData)) {
            // 拼接数据1
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
