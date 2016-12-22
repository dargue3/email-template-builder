<template>
  <div class="preview-wrapper">
    <template v-if="dropped.length">

      <!-- always a dropzone on top -->
      <div class="dropzone" data-index="0"></div>

      <!-- loop through all the added components -->
      <div v-for="(el, index) in dropped">

        <div class="row" :class="{ 'show-container' : el.sibling }">

          <dropped-component 
            :el="el"
            :dropped="dropped"
            :index="index"
            :class="containerClasses(el, index, false)">
          </dropped-component>

          <!-- component may have a sibling in the row with it, add that too -->
          <dropped-component
            v-if="el.sibling"
            :el="el.sibling"
            :dropped="dropped"
            :index="index"
            :is-sibling="true"
            :class="containerClasses(el, index, true)">
          </dropped-component>

          <div v-if="el.hasDropzone" class="fill dropzone" :class="containerClasses(el, index, false, true)"
              :data-index="index" :sibling="true"></div>

        </div>
        
        <!-- for each component, leave a dropzone underneath them -->
        <div class="dropzone" :data-index="index + 1"></div>

      </div>
    </template>


    <!-- cute filler -->
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
      highlightedContainers: [],
      beingEdited: { index: null, isSibling: false },
    }
  },

  mounted()
  {
    this.initDropzones()

    // whenever a container is edited, briefly highlight its borders
    Bus.listen('highlight-container', (index) => this.highlightContainer(index))
    
    // when component is being edited, highlight the container in red
    Bus.listen('editing-component', (data) => {
      this.beingEdited = { index: data.index, isSibling: data.isSibling}
    })
    Bus.listen('done-editing', (data) => this.beingEdited.index = null)
  },

  methods:
  {
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
      setTimeout(() => { this.$set(this.highlightedContainers, index, false) }, 1000)
    },

    /**
     * Decide if the component's container has any special classes
     *
     * @param {object} el   The component
     * @param {int} index   The index of the row
     * @param {bool} sibling Is this component the sibling in a container?
     * @param {bool} dropzone  Are these classes going onto a dropzone element?
     * @returns {object}    Classes to be attached
     */
    containerClasses(el, index, sibling, dropzone)
    {
      return {
        'show-container': el.sibling,
        'highlighted': this.highlightedContainers[index],
        'being-edited': this.beingEdited.index === index && this.beingEdited.isSibling === sibling && ! dropzone,
      }
    },


    /**
     * Create zones for the components to be dragged into
     */
    initDropzones()
    {
      let self = this;
      InteractJS.interact('.dropzone').dropzone({

        // need a 10% overlap to count as 'droppable'
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
    },
  },
};

</script>

<style lang="sass">
@import './assets/sass/library'

.preview-wrapper
  background: white
  width: 100%
  padding: 1em

.row
  display: flex
  border: 2px dashed transparent
  transition: all 200ms ease
  &:hover.show-container
    border-color: lighten($gray, 15%)
    transition: all 200ms ease

.default
  .quote
    opacity: 0.7
    color: $info
    transition: all 200ms ease
  .by
    opacity: 0.7
    color: $gray
    margin-top: 10px
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
        opacity: 0
  &.fill
    height: auto
    margin: 0 10px
    z-index: 0
    min-height: 10px
  &.highlighted
    border-color: $green
    transition: border-color 200ms ease    


.drop-active
  border: 1px dashed $blue
  margin: 0
  transition: all 200ms ease
  
.drop-target
  background: $blue
  border-color: transparent
  z-index: 1
  transition: background 200ms ease, border-color 200ms ease


</style>