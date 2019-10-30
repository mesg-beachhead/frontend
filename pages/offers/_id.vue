<template>
  <v-card v-if="item">
    <v-card-text>
      <v-row>
        <v-col :cols="3">
          <v-img :src="item.data.image" />
        </v-col>
        <v-col :cols="9">
          <h1>{{ item.data.name }}</h1>
          <p>{{ item.data.description }}</p>
          <v-list two-line>
            <v-list-item
              v-for="(info, i) in informations"
              :key="i"
              nuxt
              :to="info.to"
            >
              <v-list-item-content>
                <v-list-item-title v-text="info.title" />
                <v-list-item-subtitle v-text="info.value" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      offers: 'marketplace/list',
      stores: 'store/list'
    }),
    offer() {
      return this.offers.find((x) => x.id === this.$route.params.id)
    },
    store() {
      return this.stores[this.offer.store]
    },
    item() {
      return this.store.items[this.offer.tokenId]
    },
    informations() {
      return [
        {
          title: 'Store',
          value: this.store.name,
          to: `/stores/${this.store.address}`
        },
        { title: 'Owner', value: this.item.owner },
        { title: 'Seller', value: this.offer.seller },
        { title: 'Created at', value: this.offer.createdAt },
        { title: 'Price', value: this.offer.price },
        { title: 'Active', value: this.offer.active },
        { title: 'Buyer', value: this.offer.buyer },
        { title: 'Purchased at', value: this.offer.purchasedAt }
      ]
    }
  },
  fetch: async ({ store, params }) => {
    const offer = await store.dispatch('marketplace/fetch', {
      web3provider: window.web3.currentProvider,
      id: params.id
    })
    return store.dispatch('store/fetchItem', {
      web3provider: window.web3.currentProvider,
      store: offer.store,
      id: offer.tokenId
    })
  }
}
</script>
