# Reactive Email Template Builder
This is a nice little proof-of-concept email template builder. It is made up of two frameworks: the amazing [Vue.js](vuejs.org) `v2.1` and the Sass CSS library [Bulma](bulma.io).

[Demo](http://imgur.com/QFn0gnQ)


## Installation
I’m assuming the machine running this to be UNIX based, and I’m assuming you have Node.js and npm installed, see [these instructions](http://1.bp.blogspot.com/-AgUTyA3m7v8/Tae3lHr335I/AAAAAAAAAT4/T3iyFPNt30w/s1600/thumb.php.jpeg)
- Clone this repo
- `cd` into the repo root
- `npm run show-off`

If the build process fails or your browser never ends up showing you anything, email me and I will kick-off an [ngrok session](https://ngrok.com/) for demoing purposes.


## Usage
### Blocks
The main concept behind this template builder are drag-n-droppable elements that make up an email (e.g. some text, a few images, a button). For the purposes of the documentation, we’ll refer to them as blocks.

### Placing Blocks
Blocks  can be dragged and dropped into their desired position. Valid “dropzones” are highlighted with a blue border when a block has been picked up.  When a block can be dropped, it will turn green.
[Placing Blocks](http://imgur.com/avzn5Xf)


### Resizing Blocks
Blocks can be resized in order to make room for a sibling block. Just grab the right side of the block and drag to shrink it. Once you’ve created enough room, you’ll see a new “dropzone” highlighted in green.
[Resizing Blocks](http://imgur.com/ycLCWd9)


### Block Options
When hovering over a block you have added to the template, three icons appear in the top-right: Edit, Clone, Delete, respectively. It’s pretty explanatory what they do… but I’ll tell you about it anyways.

#### Edit
Hover over a block and press the pencil icon, this switches the toolbar to ‘Edit Block’ mode; you should see the block highlighted in some sort of color that is close to red. Depending on what type of block you are editing, various options will be shown to you. The blocks are reactive so the changes are reflected immediately.
[Edit Block](http://imgur.com/FCQuERe)


#### Clone
Hover over a block and press the icon that looks like two windows on top of each other. This will duplicate that block and place it in the row below. 

#### Delete
Hover over a block and press the X icon. It’s quick, I promise the block doesn’t even feel the pain.


### Saving
By default, the template is being saved to local browser storage whenever a change is made. To disable this feature, uncheck the setting “Automatically save template” at the bottom of the toolbar.









