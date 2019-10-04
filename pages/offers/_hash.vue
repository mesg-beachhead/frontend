<template>
  <el-container>
    <el-main>
      <trait :offer="offer" type="images" />
      <h2>Description</h2>
      <p>{{ offer.item.description }}</p>
    </el-main>
    <el-aside width="300px">
      <h1>{{ offer.item.name }}</h1>
      Price: {{ offer.price }} {{ currency }}
      <trait :offer="offer" type="dimension" />
      <trait :offer="offer" type="location" />
      <purchase-button :offer="offer" />
    </el-aside>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Trait from '~/components/traits'
import PurchaseButton from '~/components/offer/PurchaseButton'
export default {
  components: {
    Trait,
    PurchaseButton
  },
  computed: {
    ...mapGetters({
      offers: 'offer/list',
      currencies: 'currency/list'
    }),
    offer() {
      return this.offers[this.$route.params.hash]
    },
    currency() {
      if (!this.offer) return null
      return this.currencies[this.offer.currency]
    }
  },
  fetch: ({ store, params }) => store.dispatch('offer/fetchItem', params.hash)
}
</script>
