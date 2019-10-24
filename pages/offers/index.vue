<template>
  <v-container>
    <v-card>
      <v-data-table :headers="headers" :items="offers" />
    </v-card>
    <v-btn
      class="mx-2"
      fab
      dark
      fixed
      right
      bottom
      nuxt
      :to="`/offers/add`"
      color="red"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      offers: 'marketplace/list'
    }),
    headers() {
      return [
        { text: 'ID', value: 'id' },
        { text: 'Store', value: 'store' },
        { text: 'Item', value: 'tokenId' },
        { text: 'Price', value: 'price' },
        { text: 'Seller', value: 'seller' },
        { text: 'Buyer', value: 'buyer' },
        { text: 'Created at', value: 'createdAt' },
        { text: 'Purchased at', value: 'purchasedAt' },
        { text: 'Active', value: 'active' }
      ]
    }
  }
}
</script>
