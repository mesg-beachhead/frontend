<template>
  <v-container>
    <v-card>
      <v-data-table :headers="headers" :items="items">
        <template v-slot:item.name="{ item }">
          <nuxt-link :to="`/stores/${store.address}/${item.id}`">
            <v-avatar tile class="mr-2">
              <v-img :src="item.data.image" />
            </v-avatar>
            {{ item.data.name }}
          </nuxt-link>
        </template>
        <template v-slot:item.description="{ item }">
          {{ item.data.description }}
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
      :to="`/stores/${store.address}/add`"
      color="red"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
const perPage = 20
export default {
  computed: {
    ...mapGetters({
      stores: 'store/list'
    }),
    headers() {
      return [
        { text: 'name', value: 'name' },
        { text: 'description', value: 'description' },
        { text: 'owner', value: 'owner' }
      ]
    },
    store() {
      return this.stores[this.$route.params.id]
    },
    items() {
      return Object.keys(this.store.items).map((id) => this.store.items[id])
    }
  },
  fetch: async ({ store, params }) => {
    const web3provider = window.web3.currentProvider
    const address = params.id
    await store.dispatch('store/add', { address, web3provider })
    await store.dispatch('store/fetchItems', {
      web3provider,
      store: address,
      page: 1,
      perPage
    })
  }
}
</script>
