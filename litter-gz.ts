import {LitterG, IScriptInfo} from './litter-g.js';
import {define} from 'xtal-latx/define.js'

export class LitterGZ extends LitterG {

    static get is(){return 'litter-gz';}

    getScript(srcScript: HTMLScriptElement) : IScriptInfo{
        const inner = srcScript.innerHTML.trim();
        if(inner.startsWith('return')){
            const iFatArrowPos = inner.indexOf('=>');
            const lhs = inner.substr(0, iFatArrowPos).replace('return', '').replace('(', '').replace(')', '').replace('{', '').replace('}', '');
            const rhs = inner.substr(iFatArrowPos + 2);
            return {
                args: lhs.split(',').map(s => s.trim()),
                body: rhs,
            }
        }else{
            return super.getScript(srcScript);
        }
        
    }

    defGenProp(target: HTMLElement, prop: string){
        Object.defineProperty(target, prop, {
            get: function () {
                return this['_' + prop];
            },
            set: function (val) {
                this['_' + prop] = val;
                //TODO:  add debouncing
                if(this.input) {
                    this.input[prop] = val;
                    this.input = Object.assign({}, this.input);
                }else{
                    this.input = {[prop]: val};
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}

define(LitterGZ);