<template>
  <v-container>
    <v-card>
      <v-data-table :headers="headers" :items="items" disable-pagination>
        <template v-slot:item.address="{ value }">
          <nuxt-link :to="`/stores/${value}`">
            {{ value }}
          </nuxt-link>
        </template>
        <template v-slot:item.totalSupply="{ value }">
          {{ value }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      addresses: 'store/addresses',
      stores: 'store/list'
    }),
    headers() {
      return [
        { text: 'address', value: 'address' },
        { text: 'name', value: 'name' },
        { text: 'symbol', value: 'symbol' },
        { text: 'totalSupply', value: 'totalSupply' }
      ]
    },
    items() {
      return this.addresses.map((x) => this.stores[x])
    }
  },
  fetch: async ({ store }) => {
    const stores = ['0x26b4AFb60d6C903165150C6F0AA14F8016bE4aec']
    const web3provider = window.web3.currentProvider
    await Promise.all(
      stores.map((address) =>
        store.dispatch('store/add', { address, web3provider })
      )
    )
  }
}
</script>
