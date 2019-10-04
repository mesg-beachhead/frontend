<template>
  <el-button type="primary" @click="purchase(offer)"
    >Purchase for {{ priceLabel }}</el-button
  >
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    offer: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currencies: 'currency/list'
    }),
    currency() {
      return this.currencies[this.offer.currency]
    },
    priceLabel() {
      return [this.offer.price, this.currency].join(' ')
    }
  },
  methods: mapActions({
    purchase: 'transaction/create'
  })
}
</script>
