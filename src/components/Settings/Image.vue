<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-6">
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
          <p class="subtitle is-6">
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
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-6">
            Height
          </p>
        </div>
        <div class="level-item caption">
          <p class="control">
            <span class="select">
              <select v-model="el.height">
                <option value="100">short</option>
                <option value="150">medium</option>
                <option value="200">tall</option>
                <option value="300">wicked tall</option>
              </select>
            </span>
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
  width: 270px
.caption
  width: 290px

</style>