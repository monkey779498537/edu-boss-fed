<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">
        <app-aside/>
      </el-aside>
      <el-container>
        <el-header>
          <app-header/>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'

export default Vue.extend({
  name: 'layoutIndex',
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style lang='scss' scoped>
  .el-container {
    min-height: 100vh; // 类似百分比,适应屏幕的高度，比如100vh，整屏
    // min-width: 980px;
  }

  .el-aside {
    background: #d3dce6;
  }

  .el-header {
    background: #fff;
  }

  .el-main {
    background: #e9eef3;
  }
</style>
