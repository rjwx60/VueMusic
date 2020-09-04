<template>
  <div id="app" @touchmove.prevent>
    <!-- 顶部栏 -->
    <m-header></m-header>
    <!-- 导航栏控制路由与展示 -->
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 音乐播放工具栏 -->
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Player from 'components/player/player'
  import Tab from 'components/tab/tab'

  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
