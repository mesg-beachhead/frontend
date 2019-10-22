<template>
  <v-card>
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
  </v-card>
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
    },
    informations() {
      return [
        {
          title: 'Store',
          value: this.store.name,
          to: `/stores/${this.store.address}`
        },
        { title: 'Owner', value: this.item.owner }
      ]
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
