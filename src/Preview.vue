<template>
  <div class="preview-wrapper">
    <div class="template-wrapper solid-border">

      <!-- row container -->
      <div v-show="row.length" v-for="(row, index) in rows" class="columns" :class="rowClasses(index)">
        <span v-show="row.length" class="icons container-icons">
          <i class="fa fa-plus" aria-hidden="true" title="Add Container" @click="addContainer(index)"></i>
        </span>
        <span class="icons container-icons -right">
          <i class="fa fa-times" aria-hidden="true" title="Delete Container" @click="rows.splice(index, 1)"></i>
        </span>

        <!-- element containers (within rows) -->
        <div v-for="el in row" class="column dropzone" :class="customContainerClasses(el)">

          <span class="icons el-icons">
            <i class="fa fa-pencil" aria-hidden="true" title="Edit Content" @click="edit(el)"></i>
          </span>
          <span class="icons el-icons -right">
            <i class="fa fa-times" aria-hidden="true" title="Delete Element" @click="remove(el, row, index)"></i>
          </span>

          <!-- output the data in this element as HTML -->
          <span v-html="formatOutput(el)"></span>

        </div>

      </div>
    </div>
  </div>
</template>

<script>

import InteractJS from 'interactjs'

export default  {
  
  name: 'Preview',

  props: [],

  data()
  {
    return {
      rows: [
        [{ type: 'text', justify: 'centered', margin: 'a bit of'}],
        [{ type: 'text', justify: 'centered', margin: 'a bit of'}, { type: 'button', justify: 'centered', margin: 'a bit of', color: 'red'}],
        [{ type: 'divider', justify: 'left', margin: 'a little of'}],
        [{ type: 'image', justify: 'centered', margin: 'a lot of'}, { type: 'text', justify: 'right', margin: 'a bit of'}, { type: 'button', justify: 'centered', margin: 'a bit of'}],
      ],
      dummy: { type: 'text', justify: 'centered', margin: 'a bit of' },
      alteredRows: []
    }
  },

  mounted()
  {
    this.makeTemplateZone()
  },

  watch:
  {
    /**
     * If they delete all the rows, leave a dummy in there for clarity
     */
    rows(rows)
    {
      if (! rows.length) {
        this.rows.push([this.dummy])
      }
    },
  },

  methods:
  {
    /**
     * Add any user custom classes to a given component's container
     * Classes are assumed by the data stored in its data object
     *
     * @param {object} el   The container that is being styled
     * @returns {object}    Classes to attach to the container
     */
    customContainerClasses(el)
    {
      return {
        'margin30': el.margin === 'a lot of',
        'margin20': el.margin === 'a bit of',
        'margin10': el.margin === 'a little of',
        'has-text-centered': el.justify === 'centered',
        'has-text-right': el.justify === 'right',
        'has-text-left': el.justify === 'left',
      }
    },


    /**
     * Add any user custom classes to a given component
     * Classes are assumed by the data stored in its data object
     *
     * @param {object} el   The component that is being styled
     * @returns {object}    Classes to attach to the component
     */
    customComponentClasses(el)
    {
      return {
        'is-info': el.type === 'button' && el.color === 'blue',
        'is-danger': el.type === 'button' && el.color === 'red',
        'is-warning': el.type === 'button' && el.color === 'yellow',
      }
    },


    /**
     * Prepare the HTML template for what is inside a component
     */
    formatOutput(el)
    {
      return this.defaultInput(el, this.customComponentClasses(el));
    },


    /**
     * Prepare default data when an element is in the template
     *
     * @param {object} el   The element in the template
     * @returns {string}    The default HTML data to place there
     */
    defaultInput(el, classes)
    {
      switch (el.type) {
        case 'text':
          return `<span :class="classes">Some sample text</span>`
        case 'image':
          return `<img :class="classes" src="http://placehold.it/350x150">`
        case 'button':
          return `<a class="button" :class="classes" href="#">Click Me</a>`
        case 'divider':
          return `<hr :class="classes" />`
      }
    },


    /**
     * Remove a given element from the template
     *
     * @param {object} el   The element in the template
     * @param {object} parent   The row container parent
     * @param {int} index       The index of the parent in the array of rows
     */
    remove(el, parent, index)
    {
      parent.splice(parent.indexOf(el), 1);

      // add a .new class to this row container
      this.addClassToRow(index, 'new');
    },


    /**
     * Add an element component to a given row
     *
     * @param {int} index   Which index in this.rows to expand
     * @returns {void}
     */
    addContainer(index)
    {
      this.rows[index].push(this.dummy);
      
      this.addClassToRow(index, 'new');
    },


    /**
     * Add given classes to the row container with the given index
     *
     * @param {int} index       The index of the row in the list of rows
     * @param {string} classes  The classes to assign to the row
     * @param {int} time        How long the class will stick around for (ms)
     */
    addClassToRow(index, classes, time = 1000)
    {
      this.$set(this.alteredRows, index, classes);

      setTimeout(() => { this.$set(this.alteredRows, index, ''); }, time)
    },


    /**
     * Return any user-feedback classes that should be assigned to the row containers
     *
     * @param {int} index  Index of the row
     * @returns {string}   Classes to be assigned to the row
     */
    rowClasses(index)
    {
      if (this.alteredRows[index]) {
        return this.alteredRows[index] 
      }
      return '';
    },


    /**
     * Create a zone for the elements to be dragged into
     */
    makeTemplateZone()
    {
      let self = this;
      InteractJS.interact('.dropzone').dropzone({

        // only accept draggable elements
        accept: '.draggable',

        // require a 75% element overlap for a drop to be possible
        overlap: 0.75,

        // highlight all the zones that can be dropped in
        ondropactivate: function (event) {
          // add active dropzone feedback
          event.target.classList.add('drop-active');
        },

        // when a component is hovering inside a dropzone
        ondragenter: function (event) {
          var draggableElement = event.relatedTarget,
              dropzoneElement = event.target;

          // feedback the possibility of a drop: green component, blue zone
          dropzoneElement.classList.add('drop-target');
          draggableElement.classList.add('can-drop');
        },

        // when a component is no longer hovering a dropzone
        ondragleave: function (event) {

          // remove the drop feedback style
          event.target.classList.remove('drop-target');
          event.relatedTarget.classList.remove('can-drop');
        },

        // when a component has been dropped in a dropzone
        ondrop: function (event) {
          console.log('dropped in a slot');
          event.relatedTarget.classList.remove('can-drop');
        },

        // the dragging and dropping motion is over
        ondropdeactivate: function (event) {
          event.target.classList.remove('drop-active');
          event.target.classList.remove('drop-target');
        }
      });
    }
  },
};

</script>

<style lang="sass">
@import './assets/sass/library'

.template-wrapper
  background: whitesmoke
  width: 100%
  padding: 1em
  .columns
    position: relative
    border: 2px dashed transparent
    transition: all 300ms ease
    &:hover
      border-color: $gray
      transition: border-color 300ms ease
      .container-icons
        opacity: 1
        transition: opacity 300ms ease
    &.new
      border-color: $green
      transition: border-color 300ms ease
      .dropzone
        border-color: $green
        transition: border-color 300ms ease

.dropzone
  position: relative
  background: whitesmoke
  margin: 25px
  border: 2px dashed transparent
  transition: all 300ms ease
  padding-top: 20px
  z-index: 0
  &:hover
    border: 2px dashed $gray
    .el-icons
      opacity: 1
      transition: opacity 300ms ease

.icons
  position: absolute
  top: 2px
  left: 5px
  color: $blue
  opacity: 0
  transition: opacity 300ms ease
  .fa
    font-size: 17px
    &:hover
      cursor: pointer
      color: $bright-blue
  &.-right
    right: 4px
    left: auto

.drop-active
  transition: border-color 300ms ease
  border-color: $blue

.drop-target
  background: $blue
  border-color: $bright-blue
  z-index: 1
  transition: background 300ms ease, border-color 300ms ease


// classes dynamically assigned when user selects sizing options
.height200
  min-height: 200px
.height100
  min-height: 100px
.height50
  min-height: 50px

.margin30
  margin: 30px
.margin20
  margin: 20px
.margin10
  margin: 5px


</style>