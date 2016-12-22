<template>
  <div class="app-wrapper">

    <div class="columns">
      <div class="column is-5">
        <div class="heading has-text-centered">
          <p class="title">Toolbar</p>
        </div>
        <tool-bar :draggable="components" :dropped="dropped"></tool-bar>
        <p class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="autoEdit">
            Show edit page after adding component
          </label>
        </p>
        <p class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="autoSave">
            Automatically save template
          </label>
        </p>
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
      autoEdit: false,
      autoSave: true,
      components: {
        // the types of drop-in components and their default settings
        text: { 
          key: 'text',
          name: 'text', 
          justify: 'left',
          marginTop: 'none',
          marginBottom: 'none',
          fontSize: 'medium',
          color: 'black',
          text: 'Your text goes here...',
          bold: false,
          italic: false,
        },
        image: {
          key: 'image',
          name: 'image',
          justify: 'centered',
          marginTop: 'a little',
          marginBottom: 'a little',
          caption: '',
          src: 'http://placehold.it/550x200',
        },
        button: { 
          key: 'button',
          name: 'button',
          justify: 'centered',
          marginTop: 'a little',
          marginBottom: 'a little',
          label: 'Click me!',
          color: 'blue',
        },
        links: { 
          key: 'links',
          name: 'social links',
          marginTop: 'some',
          marginBottom: 'none',
          frozen: true, // no resizing this component
          links: ['fa-facebook', 'fa-twitter', 'fa-instagram'],
        },
        divider: {
          key: 'divider',
          name: 'divider',
          marginTop: 'none',
          marginBottom: 'none',
        },
        space: {
          key: 'space',
          name: 'space',
          marginTop: 'a little',
          marginBottom: 'a little',
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
      let key = event.relatedTarget.getAttribute('data-key'); // what type of component was dropped
      let isSibling = event.target.getAttribute('sibling') != null;

      if (isSibling) {
        this.dropped[index].hasDropzone = false;
        let temp = JSON.parse(JSON.stringify(this.dropped[index])) // make copy
        temp.sibling = this.components[key]
        this.$set(this.dropped, index, temp);
      }
      else {
        this.dropped.splice(index, 0, JSON.parse(JSON.stringify(this.components[key])));
        this.dropped[index].index = index;
      }

      Bus.fire('component-added', index);
      Bus.fire('highlight-container', index);

      if (this.autoEdit) {
        Bus.fire('editing-component', { index: index, isSibling: isSibling });
      }
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
      Bus.fire('editing-component', { index: data.index, isSibling: data.isSibling });
    },

    clone(data)
    {
      let newIndex = data.index + 1;
      if (data.isSibling) {
        let copy = JSON.parse(JSON.stringify(this.dropped[data.index].sibling))
        copy.index = newIndex
        this.dropped.splice(newIndex, 0, copy);
      }
      else {
        let copy = JSON.parse(JSON.stringify(this.dropped[data.index]))
        copy.sibling = undefined
        copy.index = newIndex
        this.dropped.splice(newIndex, 0, copy);
      }

      Bus.fire('component-added', { index: newIndex, isSibling: data.isSibling });
      Bus.fire('highlight-container', newIndex);

      if (this.autoEdit) {
        Bus.fire('editing-component', { index: newIndex, isSibling: data.isSibling });
      }
    },


    createDropzoneNextToComponent(index)
    {
      if (this.dropped[index].hasDropzone || this.dropped[index].sibling) {
        // don't create dropzones if there's something already there
        Bus.fire('highlight-container', index); // show some feedback about sizing
        return
      }

      let temp = JSON.parse(JSON.stringify(this.dropped[index])) // make non-reactive copy
      temp.hasDropzone = true;

      this.$set(this.dropped, index, temp);
      Bus.fire('highlight-container', index);
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

.control
  padding-left: 35px
  padding-bottom: 10px
  background: white
  &:not(:last-child)
    margin: 0
</style>
