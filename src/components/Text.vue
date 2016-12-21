<template>
  <div>
  
    <span :class="customStyling">{{ textToShow }}</span>

  </div>
</template>

<script>

export default  {
  
  name: 'TextComponent',

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
        'is-4' : this.el.size === 'small'
      }
    },

    /**
     * Return the text that goes in the component
     * 
     * @returns {string}
     */
    textToShow()
    {
      return this.el.text ? this.el.text : 'Your text here'
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