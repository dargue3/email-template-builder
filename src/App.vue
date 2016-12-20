<template>
  <div class="app-wrapper">
    
    <div class="columns">
      <div class="column is-5">
        <selector></selector>
      </div>
      <div class="column is-7">
        <preview></preview>
      </div>
    </div>

  </div>
</template>

<script>

import Selector from './Selector.vue'
import Preview from './Preview.vue'

export default {
  name: 'App',

  components: {
    Selector,
    Preview
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="sass" scoped>
@import './assets/sass/library'

.app-wrapper
  margin: 0 auto
  max-width: 1000px
  margin-top: 100px


</style>
