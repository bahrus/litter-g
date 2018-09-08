import {observeCssSelector} from 'xtal-latx/observeCssSelector.js';
import {define} from 'xtal-latx/define.js'

export class LitterG extends observeCssSelector(HTMLElement){
    static get is(){return 'litter-g';}
    static _count = 0;
    _connected!: boolean;
    insertListener(e: any){
        if (e.animationName === LitterG.is) {
            const target = e.target;
            setTimeout(() =>{
                this.registerScript(target);
            }, 0)
            

        }
    }
    addInputProp(target: any){
        const key = 'input';
        Object.defineProperty(target, key, {
            get: function () {
                return this['_' + key];
            },
            set: function (val) {
                this.dataset.litterG
            },
            enumerable: true,
            configurable: true,
        });
    }
    registerScript(target: HTMLElement){
        if(!target.firstElementChild){
            setTimeout(() =>{
                this.registerScript(target);
            }, 50);
            return;
        }
        if(target.firstElementChild!.localName !== 'script') throw "Expecting script child";
        const script = document.createElement('script');
        const text = /* js */`
import {html, render} from 'https://cdn.jsdelivr.net/npm/lit-html/lit-html.js';
import {repeat} from 'https://cdn.jsdelivr.net/npm/lit-html/lib/repeat.js';
const litterG = customElements.get('litter-g');
const count = litterG._count++;
litterG['fn_' + count] = function(){
    const helloTemplate = (name) => html\`<div>Hello ${name}!</div>\`;

    // This renders <div>Hello Steve!</div> to the document body
    render(helloTemplate('Steve'), document.body);

    // This updates to <div>Hello Kevin!</div>, but only updates the ${name} part
    render(helloTemplate('Kevin'), document.body);
}
`;
        script.type = 'module';
        script.innerHTML = text;
        document.head.appendChild(script);

    }
    connectedCallback(){
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange(){
        if(!this._connected) return;
        this.addCSSListener(LitterG.is, '[data-litter-g]', this.insertListener);
    }


}
define(LitterG);