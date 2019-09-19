<template>
  <el-container style="max-width: 1024px; margin: auto;">
    <el-header style="height: auto; text-align: center; padding: 1em;">
      <el-image :src="require('~/assets/logo.png')" fit="contain" />
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
  </el-container>
</template>

<script>
export default {}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
