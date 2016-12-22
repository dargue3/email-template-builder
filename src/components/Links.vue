<template>
  <div>
  
    <nav class="nav">
      <div class="nav-left"></div>
      <div class="nav-center">
        <div v-for="link in el.links" class="nav-item">
          <span class="icon">
            <i class="fa" :class="link" href="#"></i>
          </span>
        </div>
      </div>
      <div class="nav-right"></div>
    </nav>

  </div>
</template>

<script>

export default  {
  
  name: 'LinksComponent',

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