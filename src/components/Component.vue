<template>
  <div>
    
    <!-- dynamic component, chooses type by computed property -->
    <component :is="componentType" :el="el"></component>
    
  </div>
</template>

<script>

import TextComponent from './Text'
import ImageComponent from './Image'
import DividerComponent from './Divider'
import ButtonComponent from './Button'
import SpaceComponent from './Space'

export default  {
  
  name: 'Component',

  props:
  {
    el: Object,
  },

  components:
  {
    'k-text' : TextComponent,
    'k-divider' : DividerComponent,
    'k-image' : ImageComponent,
    'k-button' : ButtonComponent,
    'k-space' : SpaceComponent,
  },

  data()
  {
    return {

    }
  },

  computed:
  {
    /**
     * Tell the template which component file to use
     * Attach a modifier so that there are no accidental HTML confusions
     * e.g. <k-text> is safer than <text>
     */
    componentType()
    {
      return `k-${this.el.type}`
    },
  },
};

</script>

<style lang="sass">
@import '../assets/sass/library'




</style>