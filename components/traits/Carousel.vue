<template>
  <el-carousel :indicator-position="indicatorPosition" :interval="interval">
    <el-carousel-item v-for="item in value" :key="item">
      <el-image :src="item" fit="scale-down" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import trait from './mixin'
export default {
  mixins: [trait],
  props: {
    indicatorPosition: {
      type: String,
      default: 'outside'
    },
    interval: {
      type: Number,
      default: 5000
    }
  }
}
</script>
