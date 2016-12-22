<template>
  <nav class="level">
    <div class="level-left">
      <div class="level-item">
        <p class="subtitle is-5">
          Label
        </p>
      </div>
      <div class="level-item">
        <p class="control label">
          <input type="text" class="input" v-model="el.label">
        </p>
      </div>
      <div class="level-item">
        <p class="subtitle is-5">
          Color
        </p>
      </div>
      <div class="level-item">
        <p class="control">
          <span class="select">
            <select v-model="el.color">
            <option value="blue">blue</option>
            <option value="red">red</option>
            <option value="yellow">yellow</option>
            <option value="white">white</option>
          </select>
          </span>
        </p>
      </div>
    </div>
  </nav>
</template>

<script>

export default  {
  
  name: 'Button',

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

.label
  width: 125px


</style>