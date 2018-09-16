[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/litter-g)

<a href="https://nodei.co/npm/litter-g/"><img src="https://nodei.co/npm/litter-g.png"></a>

# litter-g

## Use Case

The use case for litter-g is spelled out quite nicely by [React's introductory pages](https://reactjs.org/docs/add-react-to-a-website.html):

>The majority of websites aren’t, and don’t need to be, single-page apps. With a few lines of code and no build tooling, try React in a small part of your website. You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

In one of their [examples](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) they show how you can use React inside a script tag.  litter-g does something similar, but with lit-html.

Note:  litter-g hopes to improve on the ergonomics of a similar component, [xtal-method](https://www.webcomponents.org/element/xtal-method).  Both components are meant for applications that aren't necessarily built on a JavaScript-centric paradigm.  Applications that may be built using a server-centric framework, which just wants to strategically shake some JavaScript pixie dust as needed.  Or maybe applications that are built using some "old" framework like Cold Fusion, but want to slowly convert into something more modern. 

## File Sizes

litter-g:
<img src="http://img.badgesize.io/https://unpkg.com/litter-g@0.0.15/build/ES6/litter-g.iife.js?compression=gzip">

litter-gz:
<img src="http://img.badgesize.io/https://unpkg.com/litter-g@0.0.15/build/ES6/litter-gz.iife.js?compression=gzip">



## Syntax

The litter-g web component only affects things that happen within its ShadowDOM realm.  Or, if you place it outside any ShadowDOM, it only affects things outside any ShadowDOM.

```html
<litter-g></litter-g>
...
<ul data-lit>
    <script nomodule>
        html`${input.map((i) => html`<li>${i}</li>`)}`
    </script>
</ul>
...
<script>
        document.querySelector('[data-lit]').input = ["He", "She", "They", "Ze"];
</script>
```

litter-g attaches a lit renderer property to any DOM element in its ShadowDOM realm, having attribute 'data-lit', based on the snippet of lit syntax contained within the script child, as shown above.  It also attaches an "input" property.  Any time the input property changes, the renderer updates the parent DOM element. Optionally, one can set the initial input property via the data-input attribute, as shown in the demo below.

<!--
```
<custom-element-demo>
  <template>
    <div>
        <litter-g></litter-g>
        <ul data-lit data-input='["He", "She", "They", "Ze"]'>
                <script nomodule>
                    html`${input.map((i) => html`<li>${i}</li>`)}`
                </script>
        </ul>
        <script type="module" src="https://unpkg.com/litter-g@0.0.14/litter-g.js?module"></script>
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
    import {html, render} from 'https://cdn.jsdelivr.net/npm/lit-html/lit-html.js';
    import {repeat} from 'https://cdn.jsdelivr.net/npm/lit-html/lib/repeat.js';
    `
```

Then in your litter-g tag, specify which constant to use for imports:

```html
<litter-g import="litImports"></litter-g>
```

As you can see, the "import" attribute should match the constant specified in document.head.  This will allow you to pick where the imports should come from.  

This strategy may be revisited as package maps gains momentum.

## Multivariable Functions

Sometimes we want a ui element to depend on more than one input parameter.  To do this, we use litter-gz.  litter-gz extends litter-g so it supports everything litter-g does, with the same syntax.  But in addition, it takes an expression like this:

```html
<litter-gz></litter-gz>
...
<div data-lit>
    <script nomodule>
        ({latitude, longitude}) => html`
            <a href="http://www.gps-coordinates.org/my-location.php?lat=${latitude}&lng=${longitude}" target="_blank">
                (${latitude},${longitude})
            </a> 
        `
    </script>
</div>
```

and does the following:

1)  Adds properties latitude, longitude to the div DOM element.   
2)  Updates the input property any time either of those properties change (with a little debouncing), thus causing lit-html to rerender.

**NOTE:**  Previous versions specified that the script must start with the keyword return.  This was done simply to eliminate an annoying squiggly red underline VS Code was applying to the syntax.  VS Code isn't even consistent about this.  More importantly, adding the extra usesless return statement caused the polymer serve web server to complain. 

## IE11 (This section must be read while listening to [this melody](https://youtu.be/YVi6ZYzD_Gc?t=275) )

The fact that IE11 doesn't support templates is clearly an issue with using this component.  Some build tools, such as Polymer build, make a valiant attempt to convert template literals into ES5 syntax.  Further adjustments will need to be made by litter-g to make the end product work in IE11.  More on that to come. 

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ npm test
```