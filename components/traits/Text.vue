<template>
  <span>{{ type }} - {{ value }}{{ unit }}</span>
</template>

<script>
import trait from './mixin'
export default {
  mixins: [trait]
}
</script>
