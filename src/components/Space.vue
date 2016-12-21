<template>
  <div>
  
    <div class="space has-text-centered" :class="customStyling">
      <span class="hint">( empty space )</span>
    </div>

  </div>
</template>

<script>

export default  {
  
  name: 'SpaceComponent',

  props:
  {
    el: Object
  },

  data()
  {
    return {

    }
  },

  computed:
  {
    /**
     * Return any custom classes for styling the component
     *
     * @returns {object}
     */
    customStyling()
    {
      return {
        'height150' : this.el.margin === 'a lot of',
        'height75' : this.el.margin === 'some',
        'height25' : this.el.margin === 'a little',
      }
    },
  },

  methods:
  {
    
  },
};

</script>

<style lang="sass">
@import '../assets/sass/library'

.el-container
  .space
    display: flex
    justify-content: center
    align-items: center
    .hint
      color: $gray
      opacity: 0
      transition: all 300ms ease
  &:hover .hint
    opacity: 1
    transition: all 300ms ease
  
  

</style>