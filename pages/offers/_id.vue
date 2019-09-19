<template>
  <el-container>
    <el-main>
      <trait :offer="offer" type="pictures" />
      <h2>Description</h2>
      <p>{{ offer.item.description }}</p>
    </el-main>
    <el-aside width="300px">
      <h1>{{ offer.item.name }}</h1>
      Price: {{ offer.price }} {{ offer.currency }}
      <trait :offer="offer" type="dimension" />
      <trait :offer="offer" type="location" />
      <el-button type="primary" size="medium">Buy now</el-button>
    </el-aside>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Trait from '~/components/traits'
export default {
  components: {
    Trait
  },
  computed: {
    ...mapGetters({
      offers: 'offer/items'
    }),
    offer() {
      return this.offers[this.$route.params.id]
    }
  },
  fetch: ({ store, params }) => store.dispatch('offer/fetchItem', params)
}
</script>
