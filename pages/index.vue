<template>
  <el-container>
    <el-row :gutter="12">
      <el-col
        v-for="(offer, i) in offers"
        :key="i"
        :xs="24"
        :sm="12"
        :md="6"
        style="margin-bottom: 1em;"
      >
        <offer-thumb :offer="offer" />
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import OfferThumb from '~/components/offer/Thumb'
export default {
  components: {
    OfferThumb
  },
  computed: mapGetters({
    offers: 'offer/list'
  }),
  fetch: async ({ store }) => {
    await store.dispatch('offer/fetchAll')
  }
}
</script>
