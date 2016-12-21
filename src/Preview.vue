<template>
  <div class="preview-wrapper">
    <template v-if="dropped.length">
      <!-- always a dropzone on top -->
      <div class="dropzone" data-index="0"></div>

      <!-- loop through all the added components -->
      <div v-for="(el, index) in dropped">
        <div class="el-container" :class="customContainerClasses(el, index)">
          <div class="icons">
            <i class="fa fa-pencil" aria-hidden="true" title="Edit Component" @click="edit(index)"></i>
            <i class="fa fa-clone" aria-hidden="true" title="Clone Component" @click="clone(index)"></i>
            <i class="fa fa-times" aria-hidden="true" title="Delete Component" @click="destroy(index)"></i>
          </div>

          <dropped-component :el="el"></dropped-component>

        </div>

        <div class="dropzone" :data-index="index + 1"></div>

      </div>
    </template>

    <div v-else class="dropzone has-text-centered default" data-index="0">
      <p class="quote">&ldquo;Simplicity is the ultimate sophistication&rdquo;</p>
      <p class="by">- Leonardo da Vinci</p>
    </div>
    

  </div>
</template>

<script>

import InteractJS from 'interactjs'
import Bus from './assets/js/EventBus'
import Component from './components/Component'

export default  {
  
  name: 'Preview',

  props:
  {
    dropped: Array,
  },

  components:
  {
    'dropped-component': Component
  },

  data()
  {
    return {
      highlightedContainers: []
    }
  },

  mounted()
  {
    this.initDropzones()

    // whenever a component is edited, briefly highlight its container
    Bus.listen('component-added', (index) => { this.highlightContainer(index) })
  },

  methods:
  {
    /**
     * Remove a given component from the template
     *
     * @param {int} index   The index of the component in this.dropped
     */
    destroy(index)
    {
      Bus.fire('destroy-component', index);
    },


    /**
     * Edit the data properties on this component
     *
     * @param {int} index   The index of the component to edit in this.dropped
     */
    edit(index)
    {
      Bus.fire('edit-component', index);
    },


    /**
     * Clone this component and place it right below
     * 
     * @param {int} index   The index of the component to clone in this.dropped
     */
    clone(index)
    {
      Bus.fire('clone-component', index);
    },


    /**
     * Flash this component's container after it's newly created
     *
     * @param {int} index  Which container is new in the this.dropped
     */
    highlightContainer(index)
    {
      // attach the class by setting flag for this.customContainerClasses
      this.$set(this.highlightedContainers, index, true);

      // remove the class after a second
      setTimeout(() => { this.$set(this.highlightedContainers, index, false); }, 1000)
    },


    /**
     * Add any user custom classes to the component's container
     * Classes are assumed by the data stored in its data object
     *
     * @param {object} el   The container that is being styled
     * @returns {object}    Classes to attach to the container
     */
    customContainerClasses(el, index)
    {
      return {
        'height200': el.height === 200,
        'padding30': el.margin === 'a lot of',
        'padding15': el.margin === 'some',
        'padding5': el.margin === 'a little',
        'padding0': el.margin === 'no',
        'has-text-centered': el.justify === 'centered',
        'has-text-right': el.justify === 'right',
        'has-text-left': el.justify === 'left',
        'highlighted': this.highlightedContainers[index],
      }
    },



    /**
     * Create a zone for the elements to be dragged into
     */
    initDropzones()
    {
      let self = this;
      InteractJS.interact('.dropzone').dropzone({

        overlap: 0.1,

        // only accept draggable elements
        accept: '.draggable',

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
          Bus.fire('component-dropped', event);
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

.preview-wrapper
  background: white
  width: 100%
  padding: 1em

.el-container
  position: relative
  border: 2px dashed transparent
  transition: border-color 200ms ease
  &:hover
    border-color: $gray
    transition: border-color 200ms ease
    .icons
      opacity: 1
      transition: opacity 200ms ease
  &.highlighted
    border-color: $green
    transition: all 200ms ease

.dropzone
  background: white
  z-index: 0
  margin: 0
  height: 10px
  border: 1px dashed transparent
  border-color: transparent
  transition: border-color 200ms ease
  &.default
    height: auto
    padding: 1em
    font-size: 20px
    border-width: 2px
    &.drop-target
      .quote, .by
        visibility: hidden

.quote
  color: $info
.by
  color: $gray
  margin-left: 50px



.drop-active
  border: 1px dashed $blue
  margin: 0
  transition: all 200ms ease
  
.drop-target
  background: $blue
  border-color: transparent
  z-index: 1
  transition: background 200ms ease, border-color 200ms ease

.icons
  position: absolute
  display: flex
  flex-flow: row
  align-items: center
  justify-content: center
  top: 1px
  right: 0px
  color: $blue
  opacity: 0
  transition: opacity 200ms ease
  .fa
    flex: 1
    font-size: 17px
    margin: 0 5px
    &:hover
      cursor: pointer
      color: $bright-blue




// component container classes, set dynamically depending on el's data object

.height200
  min-height: 200px
.height150
  min-height: 150px
.height100
  min-height: 100px
.height75
  min-height: 75px
.height50
  min-height: 50px
.height25
  min-height: 25px

.padding30
  padding: 30px
.padding15
  padding: 15px
.padding5
  padding: 5px
.padding0
  padding: 0


</style>