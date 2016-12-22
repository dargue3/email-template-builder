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
        'font-size12': this.el.fontSize === 'small',
        'font-size16': this.el.fontSize === 'medium',
        'font-size25': this.el.fontSize === 'big',
        'font-size35': this.el.fontSize === 'wicked-big',
        'black': this.el.color === 'black',
        'red': this.el.color === 'red',
        'blue': this.el.color === 'blue',
        'gray': this.el.color === 'gray',
        'italic': this.el.italic,
        'bold': this.el.bold,
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

.font-size12
  font-size: 12px
.font-size16
  font-size: 16px
.font-size25
  font-size: 25px
.font-size35
  font-size: 35px

.black
  color: black
.blue
  color: blue
.red
  color: red
.gray
  color: gray

.bold
  font-weight: bold
.italic
  font-style: italic
</style>