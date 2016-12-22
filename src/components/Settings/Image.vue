<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            Image URL
          </p>
        </div>
        <div class="level-item url">
          <p class="control">
            <input type="text" class="input" v-model="el.src">
          </p>
        </div>
      </div>
    </nav>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            Caption
          </p>
        </div>
        <div class="level-item caption">
          <p class="control">
            <input type="text" class="input" v-model="el.caption">
          </p>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>

export default  {
  
  name: 'Image',

  props:
  {
    el: Object,
  },

  data()
  {
    return {

    }
  },

  methods:
  {
    
  },
};

</script>

<style lang="sass" scoped>
@import '../../assets/sass/library'

.url
  width: 235px
.caption
  width: 261px

</style>