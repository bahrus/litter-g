import {observeCssSelector} from 'xtal-element/observeCssSelector.js';
import {define} from 'trans-render/define.js';
import {destruct} from 'xtal-element/destruct.js';
import {attachScriptFn, getDynScript} from 'xtal-element/attachScriptFn.js';
import {html, render} from 'lit-html/lit-html.js';
import {repeat} from 'lit-html/directives/repeat.js';
import {asyncAppend} from 'lit-html/directives/async-append.js';
import {asyncReplace} from 'lit-html/directives/async-replace.js';
import {cache} from 'lit-html/directives/cache.js';
import {classMap} from 'lit-html/directives/class-map.js';
import {guard} from 'lit-html/directives/guard.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';
import {styleMap} from 'lit-html/directives/style-map.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {until} from 'lit-html/directives/until.js';
export interface IScriptInfo{
    args: string[],
    render: string,
    handlers?: string
}
const _input = '_input';
const _target = '_target';
const _renderer = '_renderer';

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
    defGenProp(target: HTMLElement, prop: string){
        destruct(target, prop);
    }

    commitProps(props: string[], target: HTMLElement){
        props.forEach(prop =>{
            const initVal = (<any>target)[prop];
            //TODO:  move default case into litter-gz
            const localSym = Symbol(prop.toString());
            switch(prop){
                case _renderer:
                case _input:
                case _target:
                    Object.defineProperty(target, prop, {
                        get: function () {
                            return this[localSym];
                        },
                        set: function (val) {
                            this[localSym] = val;
                            if(this._input && this._renderer && !this.hasAttribute('disabled')) this._renderer(this._input, this._target || target);
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
        this.commitProps(scriptInfo.args.concat(_renderer, _input, _target), target);
        target.dataset.addedProps = 'true';
        if(!target._input){
            const inp = target.dataset.input;
            if(inp){
                target._input = JSON.parse(inp);
            }
        }

    }

    static get exports(){
        return {
            html, render, repeat, asyncAppend, asyncReplace, cache, classMap, guard, ifDefined, styleMap, unsafeHTML, until 
        }; 
    } 
    //TODO:  provide better names
    getScriptm1(srcScript: HTMLScriptElement, ignore: string, split: string[]) : IScriptInfo | null{
        const len = split.length;
        const renderScript = len === 2 ? split[1] : split[0];
        const actionScript = len === 2 ? split[0] : '';
        const inner = renderScript.trim();
        if(inner.startsWith('(') || inner.startsWith(ignore)){
            //assume multivariate function scenario
            const iFatArrowPos = inner.indexOf('=>');
            const c2del = ['(', ')', '{', '}'];
            let lhs = inner.substr(0, iFatArrowPos).replace(ignore, '').trim();
            c2del.forEach(t => lhs = lhs.replace(t, ''));
            const rhs = inner.substr(iFatArrowPos + 2);
            return {
                args: lhs.split(',').map(s => s.trim()),
                render: rhs,
                handlers: actionScript
            }
            
        }else{
            return null;
        }
        
    }

    getScript(srcScript: HTMLScriptElement) : IScriptInfo{
        const scriptTextSplit = srcScript.innerHTML.split('//render');
        const s = this.getScriptm1(srcScript, 'tr = ', scriptTextSplit);
        return (s === null) ? this.getScript2(srcScript, scriptTextSplit) : s; 
    }
    getScript2(srcScript: HTMLScriptElement, split: string[]): IScriptInfo{
        
        return {
            args: [_input],
            render: split[split.length - 1],
            handlers: split.length > 1 ? split[0] : ''
        };
    }
    registerScript(target: HTMLElement){
        let importPaths = `
const {html, render, repeat, asyncAppend, asyncReplace, cache, classMap, guard, ifDefined, styleMap, unsafeHTML, until} = customElements.get('litter-g').exports;
`;
        const importAttr = this.getAttribute('import');
        if(importAttr !== null) importPaths = (<any>self)[importAttr];
        const count = LitterG._count++;
        const scriptInfo = this.getScript((<any>target)._script);
        const args = scriptInfo.args.length > 1 ?  '{' + scriptInfo.args.join(',') + '}' : _input;
        const text = /* js */`
${scriptInfo.handlers}
const litter = (${args}) => ${scriptInfo.render};
const __fn = function(input, target){
    render(litter(input), target);
}    
`;
        this.addProps(target, scriptInfo);
        attachScriptFn(LitterG.is, target, _renderer, text, importPaths);
        
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
document.body.appendChild(document.createElement(LitterG.is));