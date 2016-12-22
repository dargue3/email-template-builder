<template>

  <div>
    <p class="control">
      <button class="button is-medium" href="#" :class="{ 'is-primary' : el.links.indexOf('fa-facebook') >= 0}"
              @click.prevent="toggle('fa-facebook')">
        <i class="fa fa-facebook"></i>
      </button>
      <button class="button is-medium" href="#" :class="{ 'is-primary' : el.links.indexOf('fa-twitter') >= 0}"
              @click.prevent="toggle('fa-twitter')">
        <i class="fa fa-twitter"></i>
      </button>
      <button class="button is-medium" href="#" :class="{ 'is-primary' : el.links.indexOf('fa-instagram') >= 0}"
              @click.prevent="toggle('fa-instagram')">
        <i class="fa fa-instagram"></i>
      </button>
      <button class="button is-medium" href="#" :class="{ 'is-primary' : el.links.indexOf('fa-yelp') >= 0}"
              @click.prevent="toggle('fa-yelp')">
        <i class="fa fa-yelp"></i>
      </button>
      <button class="button is-medium" href="#" :class="{ 'is-primary' : el.links.indexOf('fa-google-plus') >= 0}"
              @click.prevent="toggle('fa-google-plus')">
        <i class="fa fa-google-plus"></i>
      </button>
    </p>
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
    toggle(link)
    {
      let index = this.el.links.indexOf(link)
      if (index >= 0) {
        this.el.links.splice(index, 1);
      }
      else {
        this.el.links.push(link);
      }
    },
  },
};

</script>

<style lang="sass" scoped>
@import '../../assets/sass/library'

.button .fa
  font-size: 20px

</style>