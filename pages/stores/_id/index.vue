<template>
  <v-container>
    <v-card>
      <v-data-table :headers="headers" :items="items">
        <template v-slot:item.id="{ value }">
          <nuxt-link :to="`/stores/${storeId}/${value}`">
            {{ value }}
          </nuxt-link>
        </template>
        <template v-slot:item.name="{ item }">
          <v-avatar tile class="mr-2">
            <v-img :src="item.data.image" />
          </v-avatar>
          {{ item.data.name }}
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
      :to="`/stores/${storeId}/add`"
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
      storesItems: 'store/items'
    }),
    headers() {
      return [
        { text: 'id', value: 'id' },
        { text: 'name', value: 'name' },
        { text: 'description', value: 'description' },
        { text: 'owner', value: 'owner' }
      ]
    },
    storeId() {
      return this.$route.params.id
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
