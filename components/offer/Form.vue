<template>
  <div>
    <v-alert
      v-if="!allowed"
      title="Invalid account"
      type="error"
      description="Please switch to an account with the authotization to create a new offer."
      show-icon
    />
    <v-form v-model="item">
      <v-text-field v-model="item.name" label="Name" />
      <v-text-field v-model="item.description" label="Description" />
      <input type="file" @change="(e) => fileChanged(e, 'image')" />
      <v-text-field v-model="offer.price" label="Price" type="number" />
      <v-select v-model="offer.currency" :items="currencies" />
      <v-btn @click="submit">Create Offer</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      allowed: true,
      submitting: false,
      item: {
        name: null,
        description: null,
        image: null
      },
      offer: {
        price: 0,
        currency: null
      }
    }
  },
  computed: mapGetters({
    erc721Store: 'erc721/address',
    currencies: 'currency/list'
  }),
  async mounted() {
    this.allowed = await this.isMinter([
      window.web3.currentProvider.selectedAddress
    ])
    this.offer.currency = Object.keys(this.currencies)[0]
  },
  methods: {
    ...mapActions({
      createToken: 'erc721/create',
      isMinter: 'erc721/isMinter',
      createOffer: 'marketplace/create'
    }),
    async submit() {
      this.submitting = true
      const tokenId = await this.createToken(this.item)
      const id = await this.createOffer({
        store: this.erc721Store,
        tokenId,
        currency: this.offer.currency,
        price: this.offer.price
      })
      this.submitting = false
      this.$nuxt.$router.push(`/offers/${id}`)
    },
    fileChanged(event, value) {
      this.item[value] = event.srcElement.files[0]
    }
  }
}
</script>
