<template>
  <v-card>
    <v-card-title>
      Create a new item with an offer
    </v-card-title>
    <v-card-text>
      <OfferForm />
    </v-card-text>
  </v-card>
</template>

<script>
import OfferForm from '~/components/offer/Form'
export default {
  components: { OfferForm }
}
</script>
