import {LitterG} from './litter-g.js';
import {define} from 'xtal-latx/define.js'

export class LitterGZ extends LitterG {

    static get is(){return 'litter-gz';}

    getScript(srcScript: HTMLScriptElement){
        return super.getScript(srcScript);
    }
}

define(LitterGZ);