import {XtalDeco} from 'xtal-deco/xtal-deco.js';
import {define} from 'trans-render/define.js';
import {IScriptInfo} from './types.d.js';

const input = 'input';
const _target = '_target';
const _renderer = '_renderer';
export class LitterG2 extends XtalDeco {
    static is = 'litter-g2';
    static _count = 0;
    init = ({self} : any) => {
        const scriptEl = self.querySelector('script');
        if(scriptEl == null){
            setTimeout(() => {
                this.init(self);
            }, 16);
            return;
        }
        console.log(scriptEl)
    }
    actions = [];
    on = {};

    parseMultiVariateScript(srcScript: HTMLScriptElement, ignore: string) : IScriptInfo{
        const split = srcScript.innerHTML.split('//render');
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
            //Not multivariate
            return {
                args: [input],
                render: split[split.length - 1],
                handlers: split.length > 1 ? split[0] : ''
            };
        }
        
    }

    registerScript(target: HTMLScriptElement){
        let importPaths = `
const {html, render, repeat, asyncAppend, asyncReplace, cache, classMap, guard, ifDefined, styleMap, unsafeHTML, until} = customElements.get('litter-g').exports;
`;
        const importAttr = this.getAttribute('import');
        if(importAttr !== null) importPaths = (<any>self)[importAttr];
        const count = LitterG2._count++;
        const scriptInfo = this.parseMultiVariateScript(target, 'tr = ');
        const args = scriptInfo.args.length > 1 ?  '{' + scriptInfo.args.join(',') + '}' : input;
        const text = /* js */`
${scriptInfo.handlers}
const litter = (${args}) => ${scriptInfo.render};
const __fn = function(input, target){
    render(litter(input), target);
}    
`;
        this.addProps(scriptInfo);
        attachScriptFn(LitterG.is, target, _renderer, text, importPaths);
        
    }
    _addedProps = false;
    addProps(scriptInfo: IScriptInfo){
        if(this._addedProps) return;
        this.commitProps(scriptInfo.args.concat(_renderer, _input, _target), target);
        target.dataset.addedProps = 'true';
        if(!target._input){
            const inp = target.dataset.input;
            if(inp){
                target._input = JSON.parse(inp);
            }
        }

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

    _input: any;
    get input(){
        return this._input;
    }
    set input(val: any){
        this._input = val;
        this.render();
    }

    _target: Element | undefined;
    get target(){
        return this._target;
    }
    set target(val: Element | undefined){
        this._target = val;
        this.render();
    }

    _renderer: ((input: any, target: Element) => void) | undefined;
    get renderer(){
        return this._renderer;
    }
    set renderer(val: ((input: any, target: Element) => void) | undefined){
        this._renderer = val;
        this.render();
    }

    render(){
        if(this._renderer !== undefined && this._target !== undefined) this._renderer(this._input, this._target);
    }

}
define(LitterG2);