<template>
  <div>
  
    <img :src="el.src" class="img" :class="customStyling" />
    <div class="caption">
      <span>{{ el.caption }}</span>
    </div>
    

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
        'height300': this.el.height === '300',
        'height200': this.el.height === '200',
        'height150': this.el.height === '150',
        'height100': this.el.height === '100',
      }
    },
  },

  methods:
  {
    
  },
};

</script>

<style lang="sass" scoped>
@import '../assets/sass/library'

.img
  max-width: 100%

.height300
  max-height: 300px
.height200
  max-height: 200px
.height150
  max-height: 150px
.height100
  max-height: 100px

.caption
  color: gray
  font-size: 12px
  margin-top: -4px

</style>