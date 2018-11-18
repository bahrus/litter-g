import {observeCssSelector} from 'xtal-latx/observeCssSelector.js';
import {define} from 'xtal-latx/define.js';
import {attachScriptFn, getDynScript} from 'xtal-latx/attachScriptFn.js';
export interface IScriptInfo{
    args: string[],
    body: string,
}
export class LitterG extends observeCssSelector(HTMLElement){
    static get is(){return 'litter-g';}
    static _count = 0;
    _connected!: boolean;
    insertListener(e: any){
        if (e.animationName === LitterG.is) {
            const target = e.target;
            setTimeout(() =>{
                getDynScript(target, () =>{
                    this.registerScript(target);
                })
                //this.registerScript(target);
            }, 0)
        }
    }
    defGenProp(target: HTMLElement, prop: string){}

    commitProps(props: string[], target: HTMLElement){
        props.forEach(prop =>{
            const initVal = (<any>target)[prop];
            //TODO:  move default case into litter-gz
            switch(prop){
                case 'renderer':
                case 'input':
                case 'target':
                    Object.defineProperty(target, prop, {
                        get: function () {
                            return this['_' + prop];
                        },
                        set: function (val) {
                            this['_' + prop] = val;
                            if(this.input && this.renderer && !this.hasAttribute('disabled')) this.renderer(this.input, this.target || target);
                        },
                        enumerable: true,
                        configurable: true,
                    });
                    break;
                default:
                    this.defGenProp(target, prop);
            }

            if(initVal !== undefined)  (<any>target)[prop] = initVal;
            
        });
    }
    addProps(target: any, scriptInfo: IScriptInfo){
        if(target.dataset.addedProps) return;
        this.commitProps(scriptInfo.args.concat('renderer', 'input', 'target'), target);
        target.dataset.addedProps = 'true';
        if(!target.input){
            const inp = target.dataset.input;
            if(inp){
                target.input = JSON.parse(inp);
            }
        }

    }
    getScript(srcScript: HTMLScriptElement): IScriptInfo{
        return {
            args: ['input'],
            body: srcScript.innerHTML,
        };
    }
    registerScript(target: HTMLElement){
        const base = 'https://cdn.jsdelivr.net/npm/lit-html/';
        let importPaths = `
        import {html, render} from '${base}lit-html.js';
        import {repeat} from '${base}lib/repeat.js';
`;
        const importAttr = this.getAttribute('import');
        if(importAttr !== null) importPaths = (<any>self)[importAttr];
        const count = LitterG._count++;
        const scriptInfo = this.getScript((<any>target)._script);
        const args = scriptInfo.args.length > 1 ?  '{' + scriptInfo.args.join(',') + '}' : 'input';
        const text = /* js */`
const litterG = customElements.get('litter-g');
const litter = (${args}) => ${scriptInfo.body};
const __fn = function(input, target){
    render(litter(input), target);
}    
`;
        this.addProps(target, scriptInfo);
        attachScriptFn(LitterG.is, target, 'renderer', text, importPaths);
        
    }
    
    connectedCallback(){
        this.style.display = 'none';
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange(){
        if(!this._connected) return;
        this.addCSSListener(LitterG.is, '[data-lit]', this.insertListener);
    }


}
define(LitterG);