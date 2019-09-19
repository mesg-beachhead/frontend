<template>
  <el-container style="max-width: 1024px; margin: auto;">
    <el-header style="height: auto; text-align: center; padding: 1em;">
      <nuxt-link to="/">
        <el-image :src="require('~/assets/logo.png')" fit="contain" />
      </nuxt-link>
    </el-header>
    <el-alert
      v-for="transaction in transactions"
      :key="transaction.id"
      type="info"
    >
      Transaction in progress.
      <a :href="`https://etherscan.com/tx/${transaction.hash}`" target="_blank"
        >Check the progress</a
      >
    </el-alert>
    <el-main>
      <nuxt />
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    transactions: 'transaction/list'
  })
}
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
