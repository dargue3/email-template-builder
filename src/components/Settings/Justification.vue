<template>

  <nav class="level">
    <div class="level-left">
      <div class="level-item">
        <p class="subtitle is-6">
          Justification
        </p>
      </div>
      <div class="level-item">
        <p class="control">
          <span class="select">
            <select v-model="el.justify">
            <option value="left">left</option>
            <option value="centered">centered</option>
            <option value="right">right</option>
          </select>
          </span>
        </p>
      </div>
    </div>
  </nav>

</template>

<script>

export default  {
  
  name: 'Justification',

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

<style lang="sass">
@import '../../assets/sass/library'
  

</style>