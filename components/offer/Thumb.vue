<template>
  <nuxt-link :to="`/offers/${offer.id}`" class="item-thumb">
    <el-card shadow="hover" :header-style="{ padding: 0 }">
      <template v-slot:header>
        <el-image :src="offer.item.image" fit="fill" />
      </template>
      <h4>{{ offer.item.name }}</h4>
      <p>{{ offer.item.description }}</p>
    </el-card>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    offer: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  display: block;
}

.el-image {
  display: block;
}
</style>

<style>
.item-thumb > .el-card > .el-card__header {
  padding: 0;
}
</style>
