<template>
  <div>
    <component
      :is="component"
      v-for="(trait, i) in traits"
      :key="i"
      :type="type"
      :value="trait.value"
      :unit="trait.unit"
    />
  </div>
</template>

<script>
import Carousel from './Carousel'
import Text from './Text'
import Location from './Location'
export default {
  props: {
    offer: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    traits() {
      return this.offer.item.attributes.filter((x) => x.traitType === this.type)
    },
    component() {
      return {
        pictures: Carousel,
        dimension: Text,
        location: Location
      }[this.type]
    }
  }
}
</script>
