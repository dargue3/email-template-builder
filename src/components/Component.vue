<template>
  <div class="fill">

    <div class="component-container" :class="customContainerClasses(el, index)" :data-index="index"
          :tag="containerID">
      <div class="icons">
        <i class="fa fa-pencil" @click="edit" aria-hidden="true" title="Edit Component"></i>
        <i class="fa fa-clone" @click="clone" aria-hidden="true" title="Clone Component"></i>
        <i class="fa fa-times" @click="destroy" aria-hidden="true" title="Delete Component"></i>
      </div>

      <!-- dynamic component, chooses type by computed property -->
      <component :is="componentKey" :el="el"></component>

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
import LinksComponent from './Links'

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
    'k-links' : LinksComponent,
  },

  data()
  {
    return {
      
    }
  },

  mounted()
  {
    this.makeContainersResizable()

    // whenever a component is edited, briefly highlight its container
    Bus.listen('component-added', (index) => { 
      this.makeContainersResizable()
    });
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
    componentKey()
    {
      return `k-${this.el.key}`
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
     */
    destroy()
    {
      Bus.fire('destroy-component', {index: this.index, isSibling: this.isSibling});
    },


    /**
     * Tell App to edit this component
     */
    edit()
    {
      Bus.fire('edit-component', {index: this.index, isSibling: this.isSibling});
    },


    /**
     * Tell App to clone this component and place it right below
     */
    clone()
    {
      Bus.fire('clone-component', {index: this.index, isSibling: this.isSibling});
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
        'paddingT30': el.marginTop === 'a lot',
        'paddingT15': el.marginTop === 'some',
        'paddingT5': el.marginTop === 'a little',
        'paddingT0': el.marginTop === 'none',
        'paddingB30': el.marginBottom === 'a lot',
        'paddingB15': el.marginBottom === 'some',
        'paddingB5': el.marginBottom === 'a little',
        'paddingB0': el.marginBottom === 'none',
        'has-text-centered': el.justify === 'centered',
        'has-text-right': el.justify === 'right',
        'has-text-left': el.justify === 'left',
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
  &.resizing
    border-color: $gray
    transition: border-color 200ms ease
    .icons
      opacity: 0
      transition: all 300ms ease

.highlighted .component-container
  border-color: $green
  transition: border-color 200ms ease

.being-edited .component-container
  border-color: $red
  transition: border-color 200ms ease

.icons
  position: absolute
  display: flex
  flex-flow: row
  align-items: center
  justify-content: center
  top: 1px
  right: 5px
  color: $blue
  padding: 4px
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

.paddingT30
  padding-top: 30px
.paddingT15
  padding-top: 15px
.paddingT5
  padding-top: 5px
.paddingT0
  padding-top: 0

.paddingB30
  padding-bottom: 30px
.paddingB15
  padding-bottom: 15px
.paddingB5
  padding-bottom: 5px
.paddingB0
  padding-bottom: 0


</style>