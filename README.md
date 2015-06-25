#jPanel Library v0.1.0

A lightweight library for panel-like navigation. Makes use of HTML5 data-* attributes to allow for customization without writing any javascript.

##Required Classes
 - **jpanel-root**
    - Used to mark an element as a jPanel root. This is the wrapper for any individual jPanel navigator.
 - **jpanel-node**
    - Used to mark an element as a jPanel node. Each node _must_ have this class to be recognized by jPanel as a node.
 - **jpanel-transition**
    - Used on elements that may be clicked to navigate through the jPanel panels. Requires the use of the `data-jp-go-to` attribute to move to any panel other than the next panel.

##Options
 - **data-jp-root**
    - **values:** Any, but it is best if the names do not conflict if you plan on customizing jPanel with javascript.
    - **default:** If this field is ommitted, a number equal to its numerical position in the DOM is used.
    - **description:** Used to name a jPanel root. Accessible via `Jpanel["root-name"]` in your javascript code.
  - **data-jp-slide-axis**
    - **values:** x | y
    - **default:** x
    - **description:** The axis for the slide animations. Allows for left-to-right or top-down animations.
  - **data-jp-initial-position**
    - **values:** left | right | top | bottom
    - **default:** left (if `data-slide-axis="x"`), top (if `data-slide-axis="y"`)
    - **description:** Where the panel will slide from. Make sure that this matches the slide-axis (e.g. left or right for `data-slide-axis="x"`, top or bottom for `data-slide-axis="y"`)
  - **data-jp-group-in-device**
    - **values:** desktop | mobile
    - **description:** Will group one or more panels on a given device. Most common usage is to display two panels in desktop / tablets, but only show the individual panels on smaller devices.
  - **data-jp-go-to**
    - **values:** prev | next | #
    - **default:** next
    - **description:** Used for next / previous / specific panel navigation. Only works on elements with `class="jpanel-transition"`.

#License
The MIT License (MIT) Copyright (c) 2015 Jonathan Perez and other contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.