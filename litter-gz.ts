import {LitterG, IScriptInfo} from './litter-g.js';
import {define} from 'trans-render/define.js';
import {getScript, destruct} from 'xtal-element/destruct.js';
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

export class LitterGZ extends LitterG {

    static get is(){return 'litter-gz';}

    static get exports(){
        return {
            html, render, repeat, asyncAppend, asyncReplace, cache, classMap, guard, ifDefined, styleMap, unsafeHTML, until 
        } 
    } 

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