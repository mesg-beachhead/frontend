<template>
  <v-card>
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
      <v-btn color="primary" @click="transfer">Transfer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      stores: 'store/list'
    }),
    store() {
      return this.stores[this.$route.params.id]
    },
    items() {
      return this.store.items
    },
    item() {
      return this.items[this.$route.params.tokenId]
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
      web3provider,
      store: params.id,
      id: params.tokenId
    })
  },
  methods: {
    ...mapActions({
      transferItem: 'store/transferItem'
    }),
    async transfer() {
      const web3provider = window.web3.currentProvider
      await this.transferItem({
        web3provider,
        store: this.store.address,
        id: this.item.id,
        to: prompt('Which address?')
      })
    }
  }
}
</script>
