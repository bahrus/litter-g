# litter-g



Use case:  litter-g hopes to improve the ergonomics of a similar component, [xtal-method](https://www.webcomponents.org/element/xtal-method).  Both components are meant for applications that aren't necessarily dominantly built on lit-html.  They may be built using a server-centric framework, which just wants to shake some JavaScript pixie dust as needed.  Or maybe they are built using some "old" framework like Cold Fusion, but want to slowly convert into seomething more trendy. 

The use case is spelled out quite nicely by [React's introductory pages](https://reactjs.org/docs/add-react-to-a-website.html):

>The majority of websites aren’t, and don’t need to be, single-page apps. With a few lines of code and no build tooling, try React in a small part of your website. You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

If you follow their example closely, you will see they are walking you through adding full-fledged React components to build the dynamic widgets.
One could, of course, do something quite similar, with the litElement (or hyperHTMLElement or a Stencil component, or a nutmeg component, SkateJS etc) as is described in the React document above, only substituting litElement (e.g.) for React.

And these great libraries, with the help of decorators and such, make defining such a component quite easy.  In the case of some (but not all) of the ones listed above, including litElement, you could define such a component inline inside a script tag, as part of an html document, embedded within the markup, as opposed to a separate file reference.  Why would we do this?  Well, if the component is really just a "dumb view" component, it may make it easier to understand the UI if it is intermingled with the rest of the UI elements rendered outside the purview of the library.

Only, as simple as this may seem, it still seems like overkill if your dynamically rendered view doesn't need to manage any particular state.  It's more complicated than what users are used to when they simply start typing ng-repeat, or v-for, etc.

That was the mission of xtal-method, and is the mission of litter-g as well, only litter-g chooses to be tightly aligned with one particular such library -- lit-html.  In this way, we can eliminate even more boilerplate than xtal-method allows.

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

litter-g attaches a lit renderer property to any DOM element in its ShadowDOM realm, having attribute 'data-lit', based on the snippet of lit syntax contained within the script child, as shown above.  It also attaches an "input" property.  Any time the input property changes, the renderer updates the parent DOM element. 
