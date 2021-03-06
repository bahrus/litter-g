[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/litter-g)

<a href="https://nodei.co/npm/litter-g/"><img src="https://nodei.co/npm/litter-g.png"></a>

[![Actions Status](https://github.com/bahrus/p-et-alia/workflows/CI/badge.svg)](https://github.com/bahrus/p-et-alia/actions?query=workflow%3ACI)


<img src="https://badgen.net/bundlephobia/minzip/litter-g">

# litter-g

## Use Case

The use case for litter-g is spelled out quite nicely by [React's introductory pages](https://reactjs.org/docs/add-react-to-a-website.html):

>The majority of websites aren’t, and don’t need to be, single-page apps. With a few lines of code and no build tooling, try React in a small part of your website. You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

In one of their [examples](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) they show how you can use React inside a script tag.  litter-g does something similar, but with lit-html.

Note:  litter-g hopes to improve on the ergonomics of a similar component, [xtal-method](https://www.webcomponents.org/element/xtal-method).  Both components are meant for applications that aren't necessarily built on a JavaScript-centric paradigm.  Applications that may be built using a server-centric framework, which just wants to strategically shake some JavaScript pixie dust as needed.  Or maybe applications that are built using some "old" framework like Cold Fusion, but want to slowly convert into something more modern. 

## Syntax

The litter-g element applies its services onto the next sibling element:


```html
<litter-g id=pronounList></litter-g>
<ul>
    <script nomodule>html`${input.map(i => html`<li>${i}</li>`)}`</script>
</ul>
...
<script>
    pronounList.input = ["He", "She", "They", "Other"];
</script>
```

Here, we are relying on the fact that giving a DOM element an id ("pronounList"), that id becomes a global constant, if the DOM element is outside ShadowDOM.

You can also specify the input via a JSON attribute:

```html
<litter-g input='["He", "She", "They", "Other"]'></litter-g>
<ul>
    <script nomodule>
        html`${input.map(i => html`<li>${i}</li>`)}`
    </script>
</ul>
```

The snippet of lit syntax contained within the script child becomes the innerHTML renderer, and it re-renders anytime the input property changes. 



## [Demo](https://jsfiddle.net/bahrus/ma2y8ev0/6/)

<!--
```
<custom-element-demo>
  <template>
    <div>
        <ul  data-input='["He", "She", "They", "Other"]'>
                <script nomodule data-lit>
                    html`${_input.map((i) => html`<li>${i}</li>`)}`
                </script>
        </ul>

        <label>
            Latitude:
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

        
        <div -_latitude -_longitude >
            <script nomodule data-lit>
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
            label{
                display:flex;
                flex-direction:row;
            }
        </style>
        <script type="module" src="https://unpkg.com/litter-g@0.0.33/litter-g.js?module"></script>
        <script type="module" src="https://unpkg.com/p-et-alia@0.0.73/p-d.js?module"></script>
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
<litter-g input='["He", "She", "They", "Other"]'></litter-g>
<ul id="pronouns">
    <script nomodule>
        function clickHandler(e){
            console.log(e);
        }
        //render
        html`${input.map((item, idx) => html`<li @click="${clickHandler}" id="li_${idx}">${item}</li>`)}`
    </script>
</ul>
```

## Multivariable Functions

Sometimes we want a ui element to depend on more than one input parameter.  

```html
...
<litter-g id=mapCoordinates></litter-g>
<div>
    <script nomodule>
        tr = ({latitude, longitude}) => html`
            <a href="http://www.gps-coordinates.org/my-location.php?lat=${latitude}&lng=${longitude}" target="_blank">
                (${latitude},${longitude})
            </a> 
        `
    </script>
</div>
```

and does the following:

1)  Dynamically adds properties latitude, longitude to the litter-g instance.   
2)  Updates the input property any time either of those properties change (with a little debouncing [TODO](https://dev.to/thepassle/litelement-a-deepdive-into-batched-updates-3hh)), thus causing lit-html to re-render.


**NB I:** The "tr = " is optional text.  This allows VSCode to recognize the expression, and provide helpful syntax coloring, autocomplete, etc.  tr stands for "template result."

You can also add event handlers just as before, separated by the //render comment.



##   [IE11 Support](https://youtu.be/YVi6ZYzD_Gc?t=275) 

## Viewing Your Element

```
$ npm install
$ npm run serve
```

## Running Tests

$ npm run test

