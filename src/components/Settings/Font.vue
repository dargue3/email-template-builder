<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-6">
            Font size
          </p>
        </div>
        <div class="level-item">
          <p class="control">
            <span class="select">
              <select v-model="el.fontSize">
              <option value="small">small</option>
              <option value="medium">medium</option>
              <option value="big">big</option>
              <option value="wicked-big">wicked big</option>
            </select>
            </span>
          </p>
        </div>
        <div class="level-item">
          <p class="subtitle is-6">
            Color
          </p>
        </div>
        <div class="level-item">
          <p class="control">
            <span class="select">
              <select v-model="el.color">
              <option value="black">black</option>
              <option value="gray">gray</option>
              <option value="blue">blue</option>
              <option value="red">red</option>
            </select>
            </span>
          </p>
        </div>
      </div>
    </nav>

    <div>
      <p class="control">
        <button class="button is-small" href="#" :class="{ 'is-primary' : el.bold}" @click.prevent="el.bold = ! el.bold">
          <i class="fa fa-bold"></i>
        </button>
        <button class="button is-small" href="#" :class="{ 'is-primary' : el.italic}" @click.prevent="el.italic = ! el.italic">
          <i class="fa fa-italic"></i>
        </button>
      </p>
      
      <p class="control">
        <textarea class="textarea" rows="2" v-model="el.text"></textarea>
      </p>
    </div>

  </div>
</template>

<script>

export default  {
  
  name: 'Font',

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

.button .fa
  font-size: 15px

</style>