<template>
  <div class="settings-wrapper">

    <div class="header">
      <div class="back-button" @click="back">
        <i class="fa fa-chevron-left"></i>
        Blocks
      </div>
      <div class="has-text-centered title">
        <span>Edit Block</span>
      </div>
    </div>

    <form>
      <div v-for="setting in attributes" class="settings">

        <component :is="setting" :el="el"></component>

      </div>
    </form>

  </div>
</template>

<script>

import Bus from '../../assets/js/EventBus'

import Margin from './Margin'
import Justification from './Justification'
import Font from './Font'
import Image from './Image'
import Button from './Button'
import Links from './Links'

export default  {
  
  name: 'Settings',

  props: 
  {
    el: Object,
  },

  components:
  {
    'margin': Margin,
    'font': Font,
    'justification': Justification,
    'k-image': Image,
    'k-button': Button,
    'k-links': Links,
  },

  data()
  {
    return {
    }
  },

  computed:
  {
    attributes()
    {
      let allPossible = [
        'margin',
        'justification',
        'font',
        'k-image',
        'k-button',
        'k-links',
      ];

      if (this.el.key !== 'text') {
        allPossible.splice(allPossible.indexOf('font'), 1);
      }

      if (this.el.key !== 'image') {
        allPossible.splice(allPossible.indexOf('k-image'), 1);
      }

      if (this.el.key !== 'button') {
        allPossible.splice(allPossible.indexOf('k-button'), 1);
      }

      if (this.el.key !== 'links') {
        allPossible.splice(allPossible.indexOf('k-links'), 1);
      }

      if (this.el.key === 'links' || this.el.key === 'space' || this.el.key === 'divider') {
        allPossible.splice(allPossible.indexOf('justification'), 1);
      }

      return allPossible;
    },
  },

  methods:
  {
    back()
    {
      Bus.fire('done-editing', { index: this.el.index });
    },
  },
};

</script>

<style lang="sass" scoped>
@import '../../assets/sass/library'
  
.header
  display: flex
  justify-content: center
  align-items: center
  position: relative
  margin-bottom: 35px
  .title
    color: $red
  .back-button
    position: absolute
    left: 0
    top: 4px
    color: $blue
    font-size: 15px
    float: left
    &:hover
      cursor: pointer

.settings
  margin: 15px 0



</style>