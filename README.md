[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/litter-g)

<a href="https://nodei.co/npm/litter-g/"><img src="https://nodei.co/npm/litter-g.png"></a>

[![Actions Status](https://github.com/bahrus/p-et-alia/workflows/CI/badge.svg)](https://github.com/bahrus/p-et-alia/actions?query=workflow%3ACI)


<img src="https://badgen.net/bundlephobia/minzip/litter-g">

# litter-g

**NB:**  This component is undergoing experimental, breaking changes.

## Use Case

The use case for litter-g is spelled out quite nicely by [React's introductory pages](https://reactjs.org/docs/add-react-to-a-website.html):

>The majority of websites aren’t, and don’t need to be, single-page apps. With a few lines of code and no build tooling, try React in a small part of your website. You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

In one of their [examples](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) they show how you can use React inside a script tag.  litter-g does something similar, but with lit-html.

Note:  litter-g hopes to improve on the ergonomics of a similar component, [xtal-method](https://www.webcomponents.org/element/xtal-method).  Both components are meant for applications that aren't necessarily built on a JavaScript-centric paradigm.  Applications that may be built using a server-centric framework, which just wants to strategically shake some JavaScript pixie dust as needed.  Or maybe applications that are built using some "old" framework like Cold Fusion, but want to slowly convert into something more modern. 

## Syntax

By referencing the litter-g library, this only affects things outside any ShadowDOM.  The attribute "data-lit" is the magic attribute that causes the DOM element to become a target for lit-html:


```html
<ul data-lit>
    <script nomodule>
        html`${_input.map((i) => html`<li>${i}</li>`)}`
    </script>
</ul>
...
<script>
        document.querySelector('[data-lit]')._input = ["He", "She", "They", "Other"];
</script>
```

You can also specify the input via a JSON attribute:

```html
<ul data-lit data-input='["He", "She", "They", "Other"]'>
    <script nomodule>
        html`${_input.map((i) => html`<li>${i}</li>`)}`
    </script>
</ul>
```

The snippet of lit syntax contained within the script child becomes the innerHTML renderer, and it re-renders anytime the attached  _input property changes. 

## [Demo](https://jsfiddle.net/bahrus/ma2y8ev0/2/)

<!--
```
<custom-element-demo>
  <template>
    <div>
        <ul data-lit data-input='["He", "She", "They", "Ze"]'>
                <script nomodule>
                    html`${_input.map((i) => html`<li>${i}</li>`)}`
                </script>
        </ul>

        <label>
            Latutide:
            <input aria-placeholder=Latitude placeholder=Latitude value=41.903878>
            <!-- pass down (p-d) input value to _latitude property of div-->
            <p-d on=input to=[-_latitude] from=label  m=1></p-d>
        </label>
        
        

        <label>
            Longitude:
            <input aria-placeholder=Longitude placholder=Longitude value=12.452818>
            <!-- pass down (p-d) input value to _longitude property of div#long_lat -->
            <p-d on=input to=[-_longitude] from=label m=1></p-d>
        </label>

        
        <div -_latitude -_longitude data-lit>
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
        <script type="module" src="https://unpkg.com/litter-g@0.0.31/litter-g.js?module"></script>
        <script type="module" src="https://unpkg.com/p-et-alia@0.0.70/p-d.js?module"></script>
    </div>
  </template>
</custom-element-demo>
```
-->
## Directives

All the lit-html directives that are part of the lit-html library are available for use.

## Event Handling

It's a bit "hackish", but you can add event handlers, if you are careful to demark where the event handlers end, and the template begins, via the "magic string" //render:

```html
<ul id="pronouns" data-lit data-input='["He", "She", "They", "Other"]'>
    <li>I am here</li>
    <script nomodule>
        function clickHandler(e){
            console.log(e);
        }
        //render
        html`${_input.map((item, idx) => html`<li @click="${clickHandler}" id="li_${idx}">${item}</li>`)}`
    </script>
</ul>
```

## Multivariable Functions

Sometimes we want a ui element to depend on more than one input parameter.  

```html
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

1)  Adds properties _latitude, _longitude to the div DOM element.   
2)  Updates the input property any time either of those properties change (with a little debouncing), thus causing lit-html to rerender.

**NB I:** The "tr = " is optional text.  This allows VSCode to provide recognize the expression.  tr stands for "template result."

**NB II:** The underscores (_latitude, _longitude) are optional, but they are recommended, in order avoid any concerns about a native property being added to the Native HTML element (div in this case) with the same name.  It's difficult to imagine the W3C adding properties "latitude" and "longitude" to the div element, but just in case.  If they did, and you used latitude and longitude without prefixing, it's hard to predict what would happen.  Presumably, they wouldn't add properties beginning with an underscore, as that's a pattern never seen before.

You can also add event handlers just as before, separated by the //render comment.

## Using inside ShadowDOM

If you wish to use litter-g inside a ShadowDOM realm, then in addition to referencing litter-g.js you will need to insert an instance of the litter-g custom element, which then monitors for the ShadowDOM realm for elements with attribute data-lit.

```html
<host-element>
    #ShadowDOM
        ...
        <litter-g></litter-g>
        ...
        <ul id="pronouns" data-lit data-input='["He", "She", "They", "Other"]'>
            <li>I am here</li>
            <script nomodule>
                function clickHandler(e){
                    console.log(e);
                }
                //render
                html`${_input.map((item, idx) => html`<li @click="${clickHandler}" id="li_${idx}">${item}</li>`)}`
            </script>
        </ul>
</host-element>
```

##   [IE11 Support](https://youtu.be/YVi6ZYzD_Gc?t=275) 

## Viewing Your Element

```
$ npm install
$ npm run serve
```

## Running Tests

$ npm run test