<template>
  <form>
    <input v-model="name" placeholder="name" />
    <textarea v-model="description" placeholder="description" />
    <input placeholder="file" type="file" @change="updateFile" />
    <input type="submit" value="submit" @click.prevent.stop="submit" />
  </form>
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
  },
  fetch: async ({ store, params }) => {
    const web3provider = window.web3.currentProvider
    const address = params.id
    await store.dispatch('store/add', { address, web3provider })
  }
}
</script>
