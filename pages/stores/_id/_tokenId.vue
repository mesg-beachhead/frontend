<template>
  <div>
    {{ item }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      stores: 'store/list',
      items: 'store/items'
    }),
    store() {
      return this.stores[this.$route.params.id]
    },
    itemId() {
      return Object.keys(this.items).find(
        (x) =>
          this.items[x].store === this.$route.params.id &&
          this.items[x].id === this.$route.params.tokenId
      )
    },
    item() {
      return this.items[this.itemId]
    }
  },
  fetch: async ({ store, params }) => {
    const web3provider = window.web3.currentProvider
    const address = params.id
    await store.dispatch('store/add', { address, web3provider })
    await store.dispatch('store/fetchItem', {
      store: params.id,
      id: params.tokenId
    })
  }
}
</script>
