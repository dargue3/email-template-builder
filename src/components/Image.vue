<template>
  <div>
  
    <img :src="el.src" :class="customStyling" />

  </div>
</template>

<script>

export default  {
  
  name: 'ImageComponent',

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

</style>