<template>
  <el-button type="primary" @click="purchase(offer)"
    >Purchase for {{ priceLabel }}</el-button
  >
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    offer: {
      type: Object,
      required: true
    }
  },
  computed: {
    priceLabel() {
      return [this.offer.price, this.offer.currency].join(' ')
    }
  },
  methods: mapActions({
    purchase: 'transaction/create'
  })
}
</script>
