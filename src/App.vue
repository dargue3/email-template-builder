<template>
  <div class="app-wrapper">

    <div class="columns">
      <div class="column is-5">
        <div class="heading has-text-centered">
          <p class="title">Toolbar</p>
        </div>
        <tool-bar :draggable="components"></tool-bar>
      </div>
      <div class="column is-7">
        <div class="heading has-text-centered">
          <p class="title">Preview</p>
        </div>
        <preview :dropped="dropped"></preview>
      </div>
    </div>

  </div>
</template>

<script>

import Bus from './assets/js/EventBus'
import ToolBar from './ToolBar.vue'
import Preview from './Preview.vue'

export default {
  name: 'App',

  components: {
    ToolBar,
    Preview
  },

  data ()
  {
    return {
      dropped: [],
      components: {
        // the types of drop-in components and their default settings
        text: { 
          type: 'text', 
          justify: 'left',
          margin: 'no',
          size: 'small'
        },
        image: {
          type: 'image',
          justify: 'centered',
          margin: 'a little',
          height: 200,
          src: 'http://placehold.it/550x200',
        },
        button: { 
          type: 'button',
          justify: 'centered',
          margin: 'a little',
          label: 'Do Something',
          color: 'blue',
        },
        divider: {
          type: 'divider',
          margin: 'some'
        },
        space: {
          type: 'space',
          margin: 'a little'
        },
      },
    }
  },

  /**
   * Attach listeners that handle state manipulation
   */
  mounted()
  {
    Bus.listen('component-dropped', (event) => { this.addComponent(event) });
    Bus.listen('destroy-component', (index) => { this.destroy(index) });
    Bus.listen('edit-component', (index) => { this.edit(index) });
    Bus.listen('clone-component', (index) => { this.clone(index) });
  },


  methods:
  {
    /**
     * Add a component to the template depending on the info from the InteractJS event
     *
     * @param {object} event  The drop event that occurred
     */
    addComponent(event)
    {
      let index = parseInt(event.target.getAttribute('data-index')); // which index it was dropped in 
      let type = event.relatedTarget.getAttribute('data-type'); // what type of component was dropped

      this.dropped.splice(index, 0, this.components[type]);
      Bus.fire('component-added', index);
      
      // shift tool-bar to edit mode
    },

    destroy(index)
    {
      this.dropped.splice(index, 1);
    },

    edit(index)
    {
      // shift tool-bar to edit mode
    },

    clone(index)
    {
      this.dropped.splice(index, 0, this.dropped[index]);
      Bus.fire('component-added', index + 1);
    },
  },
}
</script>

<style lang="sass" scoped>
@import './assets/sass/library'

.app-wrapper
  margin: 0 auto
  max-width: 1000px
  margin-top: 100px

.heading
  margin-bottom: 20px
  .title
    color: $blue


</style>
