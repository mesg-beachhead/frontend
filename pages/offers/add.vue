<template>
  <v-card>
    <v-card-title>
      Create a new offer
    </v-card-title>
    <v-divider />
    <v-form @submit.prevent="submit">
      <v-card-text>
        <v-select v-model="store" label="Store" :items="stores" />
        <v-select v-model.number="item" label="Item" :items="items" />
        <v-select v-model="currency" label="Currency" :items="currencies" />
        <v-text-field v-model.number="price" label="Price" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit">
          Submit
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      store: null,
      item: null,
      currency: null,
      price: 0
    }
  },
  computed: {
    ...mapGetters({
      _stores: 'store/list'
    }),
    stores() {
      return Object.keys(this._stores).map((x) => ({
        value: x,
        text: this._stores[x].name
      }))
    },
    items() {
      if (!this.store) return []
      return Object.keys(this._stores[this.store].items).map((x) => ({
        value: x,
        text: `${x} -- ${this._stores[this.store].items[x].data.name}`
      }))
    },
    currencies() {
      return [{ value: process.env.BHD, text: 'BHD' }]
    }
  },
  watch: {
    async store(store) {
      await this.fetchItems({
        web3provider: window.web3.currentProvider,
        store,
        page: 1,
        perPage: 100
      })
    }
  },
  fetch: async ({ store, params }) => {
    const stores = [process.env.BHGUNS]
    const web3provider = window.web3.currentProvider
    await Promise.all(
      stores.map((address) =>
        store.dispatch('store/add', { address, web3provider })
      )
    )
  },
  methods: {
    ...mapActions({
      fetchItems: 'store/fetchItems',
      createOffer: 'marketplace/createOffer'
    }),
    async submit() {
      const web3provider = window.web3.currentProvider
      const offer = await this.createOffer({
        web3provider,
        offer: {
          store: this.store,
          item: this.item,
          currency: this.currency,
          price: this.price
        }
      })
      this.$nuxt.$router.push(`/offers/${offer.id}`)
    }
  }
}
</script>
