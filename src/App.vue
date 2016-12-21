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
          margin: 'no'
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
    Bus.listen('create-dropzone', (index) => { this.createDropzoneNextToComponent(index) });
    Bus.listen('destroy-dropzone', (index) => { this.destroyDropzoneNextToComponent(index) });
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
      let isSibling = event.target.getAttribute('sibling');

      if (isSibling) {
        this.dropped[index].hasDropzone = false;
        let temp = JSON.parse(JSON.stringify(this.dropped[index])) // make copy
        temp.sibling = this.components[type]
        this.$set(this.dropped, index, temp);
      }
      else {
        this.dropped.splice(index, 0, this.components[type]);
      }

      Bus.fire('component-added', index);
      
      // shift tool-bar to edit mode
    },

    destroy(data)
    {
      if (data.isSibling) {
        // remove the sibling from the row
        let temp = JSON.parse(JSON.stringify(this.dropped[data.index])) // make copy
        temp.sibling = undefined;
        this.$set(this.dropped, data.index, temp);
      }
      else if (this.dropped[data.index].sibling) {
        // set sibling as only component in row
        let temp = JSON.parse(JSON.stringify(this.dropped[data.index].sibling)) // make copy
        this.$set(this.dropped, data.index, temp);
      }
      else {
        this.dropped.splice(data.index, 1);
      }
    },

    edit(data)
    {

      // shift tool-bar to edit mode
    },

    clone(data)
    {
      if (data.isSibling) {
        let copy = JSON.parse(JSON.stringify(this.dropped[data.index].sibling))
        this.dropped.splice(data.index + 1, 0, copy);
      }
      else {
        let copy = JSON.parse(JSON.stringify(this.dropped[data.index]))
        copy.sibling = undefined
        this.dropped.splice(data.index + 1, 0, copy);
      }

      Bus.fire('component-added', data.index + 1);
    },


    createDropzoneNextToComponent(index)
    {
      if (this.dropped[index].hasDropzone || this.dropped[index].sibling) {
        // don't create dropzones if there's something already there
        return
      }

      let temp = JSON.parse(JSON.stringify(this.dropped[index])) // make non-reactive copy
      temp.hasDropzone = true;

      this.$set(this.dropped, index, temp);
      Bus.fire('created-dropzone', index);
    },


    destroyDropzoneNextToComponent(index)
    {
      let temp = JSON.parse(JSON.stringify(this.dropped[index])) // make non-reactive copy
      temp.hasDropzone = false;

      this.$set(this.dropped, index, temp);
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
