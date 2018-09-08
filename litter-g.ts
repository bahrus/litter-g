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
    updateProps(props: string[], target: any){
        props.forEach(prop =>{
            const initVal = target[prop];
            Object.defineProperty(target, prop, {
                get: function () {
                    return this['_' + prop];
                },
                set: function (val) {
                    this['_' + prop] = val;
                    if(this.renderer && this.input) this.renderer(this.input, target);
                },
                enumerable: true,
                configurable: true,
            });
            target[prop] = initVal;
            // if (target.hasOwnProperty(prop)) {
            //     let value = (<any>this)[prop];
            //     delete (<any>this)[prop];
            //     (<any>this)[prop] = value;
            // }
        })
    }
    addProps(target: any){
        if(target.dataset.addedProps) return;
        this.updateProps(['input', 'renderer'], target);
        target.dataset.addedProps = 'true';
    }
    registerScript(target: HTMLElement){
        this.addProps(target);
        if(!target.firstElementChild){
            setTimeout(() =>{
                this.registerScript(target);
            }, 50);
            return;
        }
        const srcS = target.firstElementChild
        if(srcS!.localName !== 'script') throw "Expecting script child";
        
        const script = document.createElement('script');
        const text = /* js */`
import {html, render} from 'https://cdn.jsdelivr.net/npm/lit-html/lit-html.js';
import {repeat} from 'https://cdn.jsdelivr.net/npm/lit-html/lib/repeat.js';
const litterG = customElements.get('litter-g');
const count = litterG._count++;

litterG['fn_' + count] = function(input, target){
    const litter = (name) => ${srcS.innerHTML};

    render(litter(input), target);
    
}
`;
        script.type = 'module';
        script.innerHTML = text;
        document.head.appendChild(script);
        this.attachRenderer(target);
    }
    attachRenderer(target: any){
        const renderer = (<any>LitterG)['fn_' + (LitterG._count - 1)];
        if(renderer === undefined){
            setTimeout(() => {
                this.attachRenderer(target);
            }, 10);
            return;
        }
        target.renderer = renderer;
    }
    connectedCallback(){
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange(){
        if(!this._connected) return;
        this.addCSSListener(LitterG.is, '[data-lit]', this.insertListener);
    }


}
define(LitterG);