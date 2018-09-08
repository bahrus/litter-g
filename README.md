# litter-g



Use case:  litter-g hopes to improve the ergonomics of a similar component, [xtal-method](https://www.webcomponents.org/element/xtal-method).  Both components are meant for applications that aren't necessarily dominantly built on a lit-html based component library.  They may be built using a server-centric framework, which just wants to shake some JavaScript pixie dust as needed.  Or maybe they are built using some "old" framework like Cold Fusion, but want to slowly convert into seomething more trendy. 

The use case is spelled out quite nicely by [React's introductory pages](https://reactjs.org/docs/add-react-to-a-website.html):

>The majority of websites aren’t, and don’t need to be, single-page apps. With a few lines of code and no build tooling, try React in a small part of your website. You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

In one look of their [examples](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) they show how you can use React inside a script tag.  litter-g does something similar, but with lit-html.


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
