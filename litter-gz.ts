import {LitterG, IScriptInfo} from './litter-g.js';
import {define} from 'trans-render/define.js';
import {getScript, destruct} from 'xtal-element/destruct.js';
export {html} from 'lit-html/lit-html.js';
export {repeat} from 'lit-html/directives/repeat.js';
export {asyncAppend} from 'lit-html/directives/async-append.js';
export {asyncReplace} from 'lit-html/directives/async-replace.js';
export {cache} from 'lit-html/directives/cache.js';
export {classMap} from 'lit-html/directives/class-map.js';
export {guard} from 'lit-html/directives/guard.js';
export {ifDefined} from 'lit-html/directives/if-defined.js';
export {live} from 'lit-html/directives/live.js';
export {styleMap} from 'lit-html/directives/style-map.js';
export {templateContent} from 'lit-html/directives/template-content.js';
export {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
export {unsafeSVG} from 'lit-html/directives/unsafe-svg.js';
export {until} from 'lit-html/directives/until.js';

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
document.body.appendChild(document.createElement(LitterGZ.is));