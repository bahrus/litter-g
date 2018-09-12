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
    commitProps(props: string[], target: any){
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
            
        })
    }
    addProps(target: any){
        if(target.dataset.addedProps) return;
        this.commitProps(['input', 'renderer'], target);
        target.dataset.addedProps = 'true';
        if(!target.input){
            const inp = target.dataset.input;
            if(inp){
                target.input = JSON.parse(inp);
            }
        }

    }
    getScript(srcScript: HTMLScriptElement): String{
        return srcScript.innerHTML;
    }
    registerScript(target: HTMLElement){
        
        if(!target.firstElementChild){
            setTimeout(() =>{
                this.registerScript(target);
            }, 50);
            return;
        }
        const srcS = target.firstElementChild as HTMLScriptElement;
        if(srcS!.localName !== 'script') throw "Expecting script child";
        
        const script = document.createElement('script');
        let importPaths = `
        import {html, render} from 'https://cdn.jsdelivr.net/npm/lit-html/lit-html.js';
        import {repeat} from 'https://cdn.jsdelivr.net/npm/lit-html/lib/repeat.js';
`;
        const importAttr = this.getAttribute('import');
        if(importAttr) importPaths = (<any>self)[importAttr];
        const count = LitterG._count++;
        
        const text = /* js */`
${importPaths}
const litterG = customElements.get('litter-g');

litterG['fn_' + ${count}] = function(input, target){
    const litter = (name) => ${this.getScript(srcS)};
    render(litter(input), target);
}
`;

        script.type = 'module';
        script.innerHTML = text;
        document.head.appendChild(script);
        this.attachRenderer(target, count);
    }
    attachRenderer(target: any, count: number){
        const renderer = (<any>LitterG)['fn_' + count];
        if(renderer === undefined){
            setTimeout(() => {
                this.attachRenderer(target, count);
            }, 10);
            return;
        }
        target.renderer = renderer;
        this.addProps(target);
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