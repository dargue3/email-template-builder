<template>
  <div class="container selector-wrapper has-text-centered">
    <div v-for="row in rowsOfComponents" class="columns">
      <div v-for="el in row" class="column draggable" :data-type="el.type">
        <div class="element">
          {{ el.type }}  
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Bus from './assets/js/EventBus'
import InteractJS from 'interactjs'

export default {
  
  name: 'Toolbar',

  props:
  {
    draggable: Object
  },

  data()
  {
    return {
      dropzonesCreated: false,
      rowsOfComponents: {
        // organized by row because Bulma has bugs in their grid framework
        first: [this.draggable.text, this.draggable.image],
        second: [this.draggable.divider, this.draggable.button],
        third: [this.draggable.space],
      }
    }
  },

  mounted()
  {
    this.makeComponentsDraggable();
  },

  methods:
  {
    /**
     * Register the components in the tool bar for draggability
     */
    makeComponentsDraggable()
    {
      let self = this;
      InteractJS.interact('.draggable').draggable({

        // call this function on every dragmove event
        onmove: dragMoveListener,

        // when a component is no longer being dragged,
        // snap the component back to where it started 
        onend: function (event) {
          var target = event.target;
          target.style.webkitTransform =
          target.style.transform =
          'translate(0px, 0px)';

          target.classList.remove('moving');

          target.setAttribute('data-x', 0);
          target.setAttribute('data-y', 0);
        }
      });

      // when a component moves, track the motion in data attributes and update visually
      // using CSS translate attributes
      function dragMoveListener (event) {
        var target = event.target;

        // keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.classList.add('moving');

        // translate the element with CSS
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }

      window.dragMoveListener = dragMoveListener;
    },
  },
};

</script>

<style lang="sass" scoped>
@import './assets/sass/library'

.selector-wrapper
  background: white
  width: 100%
  padding: 1.5em

.column
  margin: 20px
  height: 70px
  font-size: 17px
  background: whitesmoke
  padding: 0px

.element
  display: flex
  flex-flow: row
  justify-content: center
  align-items: center
  height: 100%
  width: 100%
  background-color: whitesmoke
  border: 2px dashed $gray
  transition: all 300ms ease
  &:hover
    cursor: grab
    border-color: $blue
    transition: border-color 300ms ease
  &.moving
    cursor: grab

.draggable
  z-index: 9999

.can-drop
  z-index: 1
  transition: background 300ms
  .element
    background-color: $green
    border-color: transparent
    color: white
    transition: all 300ms ease

</style>