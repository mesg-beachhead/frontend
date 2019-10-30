<template>
  <v-container>
    <v-card>
      <v-data-table :headers="headers" :items="offers">
        <template v-slot:item.id="{ value }">
          <nuxt-link :to="`/offers/${value}`">
            {{ value }}
          </nuxt-link>
        </template>
        <template v-slot:item.store="{ value }">
          <nuxt-link :to="`/stores/${value}`">
            {{ value }}
          </nuxt-link>
        </template>
        <template v-slot:item.tokenId="{ item }">
          <nuxt-link :to="`/stores/${item.store}/${item.tokenId}`">
            {{ item.tokenId }}
          </nuxt-link>
        </template>
        <template v-slot:item.createdAt="{ value }">
          {{ value }}
        </template>
        <template v-slot:item.purchasedAt="{ value }">
          {{ value }}
        </template>
        <template v-slot:item.active="{ value }">
          {{ value }}
        </template>
      </v-data-table>
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
  },
  fetch: async ({ store }) => {
    const web3provider = window.web3.currentProvider
    await store.dispatch('marketplace/fetchAll', {
      web3provider,
      page: 1,
      perPage: 10
    })
  }
}
</script>
