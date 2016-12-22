<template>

  <nav class="level">
    <div class="level-left">
      <div class="level-item">
        <p class="subtitle is-6">
          Margin top
        </p>
      </div>
      <div class="level-item">
        <p class="control">
          <span class="select">
            <select v-model="el.marginTop">
            <option value="a lot">a lot</option>
            <option value="some">some</option>
            <option value="a little">a little</option>
            <option value="none">none</option>
          </select>
          </span>
          
        </p>
      </div>
      <div class="level-item">
        <p class="subtitle is-6">
          bottom
        </p>
      </div>
      <div class="level-item">
        <p class="control">
          <span class="select">
            <select v-model="el.marginBottom">
            <option value="a lot">a lot</option>
            <option value="some">some</option>
            <option value="a little">a little</option>
            <option value="none">none</option>
          </select>
          </span>
          
        </p>
      </div>
    </div>
  </nav>

</template>

<script>

export default  {
  
  name: 'Margin',

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
  

</style>