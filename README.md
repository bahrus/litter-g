[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/litter-g)

<a href="https://nodei.co/npm/litter-g/"><img src="https://nodei.co/npm/litter-g.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/litter-g">


# litter-g

## Use Case

The use case for litter-g is spelled out quite nicely by [React's introductory pages](https://reactjs.org/docs/add-react-to-a-website.html):

>The majority of websites aren’t, and don’t need to be, single-page apps. With a few lines of code and no build tooling, try React in a small part of your website. You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

In one of their [examples](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) they show how you can use React inside a script tag.  litter-g does something similar, but with lit-html.

Note:  litter-g hopes to improve on the ergonomics of a similar component, [xtal-method](https://www.webcomponents.org/element/xtal-method).  Both components are meant for applications that aren't necessarily built on a JavaScript-centric paradigm.  Applications that may be built using a server-centric framework, which just wants to strategically shake some JavaScript pixie dust as needed.  Or maybe applications that are built using some "old" framework like Cold Fusion, but want to slowly convert into something more modern. 

## Syntax

The litter-g web component only affects things that happen within its ShadowDOM realm.  Or, if you place it outside any ShadowDOM, it only affects things outside any ShadowDOM.

```html
<litter-g></litter-g>
...
<ul data-lit>
    <script nomodule>
        html`${_input.map((i) => html`<li>${i}</li>`)}`
    </script>
</ul>
...
<script>
        document.querySelector('[data-lit]')._input = ["He", "She", "They", "Ze"];
</script>
```

litter-g attaches a lit renderer property to any DOM element in its ShadowDOM realm, having attribute 'data-lit', based on the snippet of lit syntax contained within the script child, as shown above.  It also attaches an "_input" property.  Any time the _input property changes, the renderer updates the parent DOM element. Optionally, one can set the initial input property via the data-input attribute, as shown in the demo below.

<!--
```
<custom-element-demo>
  <template>
    <div>
        <litter-gz></litter-gz>
        <ul data-lit data-input='["He", "She", "They", "Ze"]'>
                <script nomodule>
                    html`${_input.map((i) => html`<li>${i}</li>`)}`
                </script>
        </ul>

        <div>Latutide: </div>
        <input aria-placeholder="Latitude" placeholder="Latitude" value="41.903878">
        <!-- pass down (p-d) input value to _latitude property of div#long_lat -->
        <p-d on="input" to="#long_lat" prop="_latitude" m="1"></p-d>

        <div>Longitude:</div>
        <input aria-placeholder="Longitude" placholder="Longitude" value="12.452818">
        <!-- pass down (p-d) input value to _longitude property of div#long_lat -->
        <p-d on="input" to="#long_lat" prop="_longitude" m="1"></p-d>
        
        <div data-lit id="long_lat">
            <script nomodule>
                tr = ({_latitude, _longitude}) => html`
                    <a href="http://www.gps-coordinates.org/my-location.php?lat=${_latitude}&lng=${_longitude}" target="_blank">
                        (${_latitude},${_longitude})
                    </a> 
                `;
            </script>
        </div>


        <style>
            .fieldInput{
                display:flex;
                flex-direction: row;
            }
        </style>
        <script type="module" src="https://unpkg.com/litter-g@0.0.20/litter-gz.js?module"></script>
        <script type="module" src="https://unpkg.com/p-d.p-u@0.0.105/p-d.js?module"></script>
    </div>
  </template>
</custom-element-demo>
```
-->

## References

A natural question arises -- where to get the lit-html references from?  Out of the box, litter-g just hardcodes some fine-for-development defaults:

```JavaScript
    import {html, render} from 'https://cdn.jsdelivr.net/npm/lit-html/lit-html.js';
    import {repeat} from 'https://cdn.jsdelivr.net/npm/lit-html/lib/repeat.js';
```

However, if you want to use this in production, or if you want to access more of lit's directives, it would be best to create your own references to some (bundled) files that best meet your target browser / geography.

To do this, create a string constant in document.head, which provides your prefered imports.  For example:

```JavaScript
    const litImports = `
    import {render, html} from '//unpkg.com/lit-html?module'
    `
```

Then in your litter-g tag, specify which constant to use for imports:

```html
<litter-g import="litImports"></litter-g>
```

As you can see, the "import" attribute should match the constant specified in document.head.  This will allow you to pick where the imports should come from.

## Multivariable Functions

Sometimes we want a ui element to depend on more than one input parameter.  To do this, we use litter-gz.  litter-gz extends litter-g so it supports everything litter-g does, with the same syntax.  But in addition, it takes an expression like this:

```html
<litter-gz></litter-gz>
...
<div data-lit>
    <script nomodule>
        tr = ({_latitude, _longitude}) => html`
            <a href="http://www.gps-coordinates.org/my-location.php?lat=${_latitude}&lng=${_longitude}" target="_blank">
                (${_latitude},${_longitude})
            </a> 
        `
    </script>
</div>
```

and does the following:

1)  Adds properties latitude, longitude to the div DOM element.   
2)  Updates the input property any time either of those properties change (with a little debouncing), thus causing lit-html to rerender.

**NB I:** The "tr = " is optional text.  This allows VSCode to provide intellisense on the expression without giving syntax errors by the polymer server (possibly caused by how Babel interprets the text.)   It stands for template result.

**NB II:** The underscores (_latitude, _longitude) are optional, but they are recommended, in order avoid any concerns about a native property being added to the Native HTML element (div in this case) with the same name.  It's difficult to imagine the W3C adding properties "latitude" and "longitude" to the div element, but just in case.  If they did, and you used latitude and longitude without prefixing, it's hard to predict what would happen.  Presumably, they wouldn't add properties begining with an underscore, as that's a pattern never seen before.

##   [IE11 Support](https://youtu.be/YVi6ZYzD_Gc?t=275) 

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ npm test
```