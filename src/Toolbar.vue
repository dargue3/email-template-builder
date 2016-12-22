<template>
  <div class="container toolbar-wrapper">

    <!-- apply a fade when switching between components -->
    <transition name="fade" mode="out-in">

      <!-- this component is either Blocks or Settings -->
      <component
        :is="viewing"
        :draggable="draggable"
        :dropped="dropped"
        :el="editing">
      </component>

    </transition>
  </div>
</template>

<script>

import Bus from './assets/js/EventBus'
import Settings from './components/Settings/Settings'
import Blocks from './components/Blocks'

export default {
  
  name: 'Toolbar',

  props:
  {
    draggable: Object,
    dropped: Array,
  },

  components:
  {
    'edit': Settings,
    'blocks': Blocks,
  },

  data()
  {
    return {
      editing: this.dropped[0],
    }
  },

  computed:
  {
    viewing()
    {
      if (this.editing) {
        return 'edit'
      }
      return 'blocks'
    },
  },

  mounted()
  {
    Bus.listen('editing-component', (data) => this.startEditing(data))
    Bus.listen('done-editing', () => this.editing = null);

    Bus.listen('destroy-component', (data) => {
      if (this.editing) {
        Bus.fire('done-editing', { index: this.editing.index })
      }
    });
  },

  methods:
  {
    startEditing(data)
    {
      if (this.editing && this.editing.index === data.index &&
          this.editing.isSibling === data.isSibling) {
        // already editing this component
        return;
      }

      if (this.editing) {
        Bus.fire('done-editing', { index: this.editing.index });
      }

      // turn to null then back in order to do a cool fade
      this.editing = null;
      setTimeout(() => {
        if (data.isSibling) {
          this.editing = this.dropped[data.index].sibling
        }
        else {
          this.editing = this.dropped[data.index]
        }
      }, 245)
    },
  },
};

</script>

<style lang="sass" scoped>
@import './assets/sass/library'

.toolbar-wrapper
  background: white
  width: 100%
  padding: 1.5em
  min-height: 410px

</style>