import {LitterG, IScriptInfo} from './litter-g.js';
import {define} from 'trans-render/define.js';
import {getScript, destruct} from 'xtal-element/destruct.js';

export class LitterGZ extends LitterG {

    static get is(){return 'litter-gz';}

    getScript(srcScript: HTMLScriptElement) : IScriptInfo{
        const s = getScript(srcScript, 'tr = ');
        return (s === null) ? super.getScript(srcScript) : s; 
    }

    defGenProp(target: HTMLElement, prop: string){
        destruct(target, prop);
    }
}

define(LitterGZ);