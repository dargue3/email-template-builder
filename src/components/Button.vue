<template>
  <div>
  
    <button class="button" :class="customStyling">{{ el.label }}</button>

  </div>
</template>

<script>

export default  {
  
  name: 'ButtonComponent',

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
        'is-info' : this.el.color === 'blue',
        'is-danger' : this.el.color === 'red',
        'is-warning' : this.el.color === 'yellow',
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