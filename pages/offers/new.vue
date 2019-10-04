<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>Create a new item with an offer</span>
    </div>
    <OfferForm />
  </el-card>
</template>

<script>
import OfferForm from '~/components/offer/Form'
export default {
  components: { OfferForm }
}
</script>
