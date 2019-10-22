<template>
  <nuxt-link :to="`/offers/${offer.id}`" class="item-thumb">
    <v-card>
      <v-img
        class="white--text align-end"
        height="200px"
        :src="offer.item.image"
      >
        <v-card-title>{{ offer.item.name }}</v-card-title>
      </v-img>
      <v-card-text v-html="offer.item.description" />
    </v-card>
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
