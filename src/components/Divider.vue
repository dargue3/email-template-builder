<template>
  <div>
  
    <hr :class="customStyling" />

  </div>
</template>

<script>

export default  {
  
  name: 'DividerComponent',

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