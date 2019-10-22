<template>
  <v-card>
    <v-card-title>
      Create a new item
    </v-card-title>
    <v-divider />
    <v-form @submit.prevent="submit">
      <v-card-text>
        <v-text-field v-model="name" label="name" />
        <v-textarea v-model="description" label="description" />
        <v-file-input v-model="image" placeholder="file" type="file" />
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
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      name: null,
      description: null,
      image: null
    }
  },
  computed: {
    ...mapGetters({
      stores: 'store/list'
    }),
    storeId() {
      return this.$route.params.id
    },
    store() {
      return this.stores[this.storeId]
    }
  },
  fetch: async ({ store, params }) => {
    const web3provider = window.web3.currentProvider
    const address = params.id
    await store.dispatch('store/add', { address, web3provider })
  },
  methods: {
    updateFile(e) {
      this.image = e.srcElement.files[0]
    },
    async submit() {
      const token = await this.$store.dispatch('store/createItem', {
        store: this.store,
        name: this.name,
        description: this.description,
        image: this.image
      })
      this.$nuxt.$router.push(`/stores/${this.store.address}/${token}`)
    }
  }
}
</script>
