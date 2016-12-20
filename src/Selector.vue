<template>
  <div class="container selector-wrapper has-text-centered solid-border">
    <div v-for="row in rowsOfComponents" class="columns">
      <div v-for="element in row" class="column draggable">
        <div class="element">
          {{ element.type }}  
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import InteractJS from 'interactjs'

export default {
  
  name: 'Selector',

  props: [],

  data()
  {
    return {
      rowsOfComponents: {
        first: [
          { type: 'text', height: 100 },
          { type: 'image', height: 200 },
        ],
        second: [
          { type: 'button', height: 100, color: 'blue' },
          { type: 'divider', height: 50 },
        ]
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

        // translate the element with CSS
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
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
  height: 100px
  font-size: 25px
  background: whitesmoke
  padding: 0px

.element
  height: 100%
  width: 100%
  display: flex
  flex-flow: row
  border: 2px dashed $gray
  justify-content: center
  align-items: center
  transition: all 300ms

.draggable
  z-index: 9999

.can-drop
  background: $green
  border: none
  z-index: 9999
  transition: background, border 300ms

</style>