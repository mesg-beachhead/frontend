<template>
  <el-container>
    <el-row :gutter="12">
      <el-col
        :xs="24"
        :sm="12"
        :md="6"
        v-for="offer in offers"
        :key="offer.id"
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
  fetch: ({ store }) => store.dispatch('offer/fetch'),
  computed: mapGetters({
    offers: 'offer/list'
  })
}
</script>
