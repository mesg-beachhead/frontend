<template>
  <v-container>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item }}
      </li>
    </ul>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
const perPage = 20
export default {
  computed: {
    ...mapGetters({
      stores: 'store/list',
      storesItems: 'store/items'
    }),
    storeId() {
      return this.$route.params.id
    },
    store() {
      return this.stores[this.storeId]
    },
    items() {
      return Object.keys(this.storesItems)
        .filter((id) => this.storesItems[id].store === this.storeId)
        .map((id) => this.storesItems[id])
    }
  },
  fetch: async ({ store, params }) => {
    const web3provider = window.web3.currentProvider
    const address = params.id
    await store.dispatch('store/add', { address, web3provider })
    await store.dispatch('store/fetchItems', {
      store: address,
      page: 1,
      perPage
    })
  }
}
</script>
