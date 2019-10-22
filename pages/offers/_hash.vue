<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <img :src="offer.item.image" />
        <trait :offer="offer" type="images" />
        <h2>Description</h2>
        <p>{{ offer.item.description }}</p>
        <h3>Owner</h3>
        <p>{{ offer.item.owner }}</p>
        <h3>Seller</h3>
        <p>{{ offer.seller }}</p>
      </v-col>
      <v-col cols="3">
        <h1>{{ offer.item.name }}</h1>
        Price: {{ offer.price }} {{ currency }}
        <trait :offer="offer" type="dimension" />
        <trait :offer="offer" type="location" />
        <purchase-button :offer="offer" />
      </v-col>
    </v-row>
  </v-container>
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
