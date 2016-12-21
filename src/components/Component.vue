<template>
  <div class="fill">

    <div class="component-container" :class="customContainerClasses(el, index)" :data-index="index"
          :tag="containerID">
      <div class="icons">
        <i class="fa fa-pencil" @click="edit(index)" aria-hidden="true" title="Edit Component"></i>
        <i class="fa fa-clone" @click="clone(index)" aria-hidden="true" title="Clone Component"></i>
        <i class="fa fa-times" @click="destroy(index)" aria-hidden="true" title="Delete Component"></i>
      </div>

      <!-- dynamic component, chooses type by computed property -->
      <component :is="componentType" :el="el"></component>

    </div>
    
    
    
  </div>
</template>

<script>

import InteractJS from 'interactjs'
import Bus from '../assets/js/EventBus'
import TextComponent from './Text'
import ImageComponent from './Image'
import DividerComponent from './Divider'
import ButtonComponent from './Button'
import SpaceComponent from './Space'

export default  {
  
  name: 'Component',

  props:
  {
    dropped: Array,
    el: Object,
    index: Number,
    isSibling: Boolean
  },

  components:
  {
    'k-text' : TextComponent,
    'k-divider' : DividerComponent,
    'k-image' : ImageComponent,
    'k-button' : ButtonComponent,
    'k-space' : SpaceComponent,
  },

  data()
  {
    return {
      highlightedContainers: []
    }
  },

  mounted()
  {
    this.makeContainersResizable()

    // whenever a component is edited, briefly highlight its container
    Bus.listen('component-added', (index) => { 
      this.highlightContainer(index)
      this.makeContainersResizable()
    })
  },

  computed:
  {
    /**
     * Tell the template which component file to use
     * Attach a modifier so that there are no accidental HTML confusions
     * e.g. <k-text> is safer than <text>
     *
     * @returns {string}
     */
    componentType()
    {
      return `k-${this.el.type}`
    },


    /**
     * Create an HTML for ease of finding container elements
     *
     * @returns {string}
     */
    containerID()
    {
      if (this.isSibling) {
        return `${this.index}-sibling`
      }
      return `${this.index}`
    }
  },

  methods:
  {
    /**
     * Tell App to remove this component from the template
     *
     * @param {int} index   The index of the component in this.dropped
     */
    destroy(index)
    {
      Bus.fire('destroy-component', {index: index, isSibling: this.isSibling});
    },


    /**
     * Tell App to edit this component
     *
     * @param {int} index   The index of the component to edit in this.dropped
     */
    edit(index)
    {
      Bus.fire('edit-component', {index: index, isSibling: this.isSibling});
    },


    /**
     * Tell App to clone this component and place it right below
     * 
     * @param {int} index   The index of the component to clone in this.dropped
     */
    clone(index)
    {
      Bus.fire('clone-component', {index: index, isSibling: this.isSibling});
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
      setTimeout(() => { this.$set(this.highlightedContainers, index, false) }, 1000)
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
        'resizable': ! el.frozen,
      }
    },

    /**
     * Tell InteractJS that the components' containers are resizable
     */
    makeContainersResizable()
    {
      let self = this;
      InteractJS.interact('.resizable')
        .resizable({
          edges: { left: true, right: true },
          onstart: function(event) {
            event.target.classList.add('resizing')
          },
          onend: function(event) {
            event.target.classList.remove('resizing')
          }
        })
        .on('resizemove', function (event) {
          let index = parseInt(event.target.getAttribute('data-index'));
          let isSibling = self.targetIsSibling(event.target)

          if (self.index !== index && self.isSibling !== isSibling) {
            // there are many of these listeners, one in each Component class
            // just allow the appropriate ones to run
            return
          }

          let width = event.rect.width;
          let upperLimit = self.howWideCanContainerBe(event.target);

          // dont resize above upperLimit or below 200px
          if (width > upperLimit || width < 200) {
            return;
          }

          if (width > 400) {
            Bus.fire('destroy-dropzone', index);
          }
          else if (width <= 400) {
            // add a dropzone if there's enough room in the container
            self.createAnotherDropzoneInsideContainer(event.target);
          }

          // update the element's style
          let target = event.target
          target.style.width  = event.rect.width + 'px';

          // translate when resizing from top or left edges
          let x = (parseFloat(target.getAttribute('data-x')) || 0)
          x += event.deltaRect.left;

          target.setAttribute('data-x', x);
        });
    },


    /**
     * When a singluar container is shrunk enough to allow room for another component,
     * tell App that this component has a new brother or sister!
     *
     * @param {object} container  The container being resized
     */
    createAnotherDropzoneInsideContainer(container)
    {
      let index = parseInt(container.getAttribute('data-index')); // which index it was dropped in

      if (! this.dropped[index].sibling && ! this.isSibling) {
        Bus.fire('create-dropzone', index)
      }
    },


    /**
     * Is the container the sibling in the row?
     *
     * @param {object} container  The container being resized
     * @returns {bool} 
     */
    targetIsSibling(container)
    {
      return container.getAttribute('tag').includes('sibling');
    },


    /**
     * There can be up to two siblings in a container
     * Make sure they leave space for eachother
     *
     * @param {object} container  The container that is being resized
     * @returns {int}  
     */
    howWideCanContainerBe(container)
    {
      let limit = 550; // initial width when just single element

      if (this.isSibling) {
        var otherMember = document.querySelector(`[tag="${this.index}"]`)
      }
      else {
        var otherMember = document.querySelector(`[tag="${this.index}-sibling"]`)
      }

      // subtract the width of the other member
      if (otherMember) {
        limit -= otherMember.offsetWidth
      }

      return limit;
    }
  }
};

</script>

<style lang="sass">
@import '../assets/sass/library'

.fill
  width: 100%
  display: inline-block
  z-index: 1

.component-container
  position: relative
  width: 100%
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
  &.resizing
    border-color: $gray
    transition: border-color 200ms ease
    .icons
      opacity: 0
      transition: all 300ms ease

.icons
  position: absolute
  display: flex
  flex-flow: row
  align-items: center
  justify-content: center
  top: 1px
  right: 5px
  color: $blue
  z-index: 9999
  background: white
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